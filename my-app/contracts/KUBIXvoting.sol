pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";

contract KubixVoting {
    using SafeMath for uint256;
    IERC20 public kubixToken;
    address public dao;

    struct PollOption {
        string optionName;
        uint256 votes;
    }

    struct Proposal {
        string name;
        string description;
        string execution;
        uint256 totalVotes;
        mapping(address => uint256) votes;
        uint256 maxBalance;
        uint256 minBalance;
        uint256 timeInMinutes;
        uint256 creationTimestamp;
        PollOption[] options;
    }

    Proposal[] public activeProposals;
    uint256[] public activeProposalIndices;
    uint256[] public completedProposalIndices;

    event NewProposal(uint256 indexed proposalId, string name);

    constructor(address _kubixToken, address _dao) {
        kubixToken = IERC20(_kubixToken);
        dao = _dao;
        activeProposalIndices.push(0); // Initialize with a dummy value
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can call this function");
        _;
    }

    modifier whenNotExpired(uint256 _proposalId) {
        Proposal storage proposal = activeProposals[_proposalId];
        require(
            block.timestamp <=
                proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes,
            "Voting time expired"
        );
        _;
    }

    function createProposal(
        string memory _name,
        string memory _description,
        string memory _execution,
        uint256 _maxBalance,
        uint256 _minBalance,
        uint256 _timeInMinutes,
        string[] memory _options
    ) external onlyDAO {
        require(_minBalance > 0, "Min balance must be greater than 0");
        require(
            _maxBalance > _minBalance,
            "Max balance must be greater than min balance"
        );

        uint256 newId = activeProposals.length;

        activeProposalIndices.push(newId);
        activeProposals.push();
        Proposal storage newProposal = activeProposals[newId];
        newProposal.name = _name;
        newProposal.description = _description;
        newProposal.execution = _execution;
        newProposal.totalVotes = 0;
        newProposal.maxBalance = _maxBalance;
        newProposal.minBalance = _minBalance;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;
    

        for (uint256 i = 0; i < _options.length; i++) {
            newProposal.options.push(PollOption(_options[i], 0));
        }

        emit NewProposal(newId, _name);
    }

    function vote(
        uint256 _proposalId,
        address _voter,
        uint256 _optionIndex
    ) external whenNotExpired(_proposalId) {
        Proposal storage proposal = activeProposals[_proposalId];
        require(proposal.votes[_voter] == 0, "Already voted");

        uint256 balance = kubixToken.balanceOf(_voter);
        require(balance > 0, "No KUBIX tokens");
        uint256 balanceConverted = balance / 10**18;


        if (balanceConverted > proposal.maxBalance) {
            balanceConverted = proposal.maxBalance;
        }

        uint256 voteWeight = calculateVoteWeight(_proposalId, balanceConverted);

        proposal.totalVotes += voteWeight;
        proposal.votes[_voter] = voteWeight;
        proposal.options[_optionIndex].votes += voteWeight;
    }

    function calculateVoteWeight(uint256 _proposalId, uint256 _balance) public view returns (uint256) {
        Proposal storage proposal = activeProposals[_proposalId];
        uint256 range = proposal.maxBalance.sub(proposal.minBalance);
        uint256 adjustedBalance = (_balance.sub(proposal.minBalance)).add(1);
        
        // Convert the numbers to the fixed point format used by the library
        int128 fixedRange = ABDKMath64x64.fromUInt(range);
        int128 fixedAdjustedBalance = ABDKMath64x64.fromUInt(adjustedBalance);
        
        // Calculate the square roots for range and adjustedBalance
        int128 sqrtFixedRange = ABDKMath64x64.sqrt(fixedRange);
        int128 sqrtFixedAdjustedBalance = ABDKMath64x64.sqrt(fixedAdjustedBalance);

        // Use the new formula, you should convert 9 to fixed point format as well
        int128 fixedWeight = ABDKMath64x64.add(
            ABDKMath64x64.mul(
                ABDKMath64x64.div(ABDKMath64x64.fromUInt(9), sqrtFixedRange),
                sqrtFixedAdjustedBalance
            ),
            ABDKMath64x64.fromUInt(1)
        );

        // Convert back to uint256 before returning
        uint256 weight = ABDKMath64x64.toUInt(fixedWeight);

        return weight;
    }



    function getWinner(uint256 _completedProposalIndex) external view returns (string memory) {
        uint256 _completedProposalId = completedProposalIndices[_completedProposalIndex];
        Proposal storage proposal = activeProposals[_completedProposalId];
        
        uint256 highestVotes = 0;
        uint256 winningOptionIndex;

        for (uint256 i = 0; i < proposal.options.length; i++) {
            if (proposal.options[i].votes > highestVotes) {
                highestVotes = proposal.options[i].votes;
                winningOptionIndex = i;
            }
        }

        return proposal.options[winningOptionIndex].optionName;
    }

    function moveToCompleted() public onlyDAO {
        uint256 i = 1; // Start from 1 because 0 is a dummy value
        while (i < activeProposalIndices.length) {
            uint256 proposalId = activeProposalIndices[i];
            Proposal storage proposal = activeProposals[proposalId];
            if (block.timestamp > proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes) {
                completedProposalIndices.push(proposalId); // Push the index instead of the proposal

                // Remove the expired proposal index from the activeProposalIndices array by shifting the elements
                for (uint256 j = i; j < activeProposalIndices.length - 1; j++) {
                    activeProposalIndices[j] = activeProposalIndices[j + 1];
                }
                activeProposalIndices.pop();
            } else {
                i++;
            }
        }
    }

    function activeProposalsCount() public view returns (uint256) {
        return activeProposalIndices.length - 1; // Subtract 1 because of the dummy value
    }

    function completedProposalsCount() public view returns (uint256) {
        return completedProposalIndices.length;
    }

    function getOption(uint256 _proposalId, uint256 _optionIndex)
        public
        view
        returns (string memory optionName, uint256 votes)
    {
        Proposal storage proposal = activeProposals[_proposalId];
        PollOption storage option = proposal.options[_optionIndex];
        return (option.optionName, option.votes);
    }
    
    function getOptionsCount(uint256 _proposalId) public view returns (uint256) {
        Proposal storage proposal = activeProposals[_proposalId];
        return proposal.options.length;
    }


}
