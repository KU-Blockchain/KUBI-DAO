pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract KubidVoting {
    using SafeMath for uint256;

    IERC20 public kubidToken;
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
        PollOption[] options;
        uint256 creationTimestamp;
        uint256 timeInMinutes;
    }

    Proposal[] public proposals;
    uint256 public activeProposalId;
    Proposal[] public activeProposals;
    uint256[] public activeProposalIndices;
    uint256[] public completedProposalIndices;

    event NewProposal(uint256 indexed proposalId, string name);

    constructor(address _kubidToken, address _dao) {
        kubidToken = IERC20(_kubidToken);
        dao = _dao;
        activeProposalIndices.push(0);
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can call this function");
        _;
    }

    modifier whenNotExpired(uint256 _proposalId) {
        Proposal storage proposal = proposals[_proposalId];
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
        uint256 _timeInMinutes,
        string[] memory _options
    ) external onlyDAO {
        uint256 newId = activeProposals.length;

        activeProposalIndices.push(newId);
        activeProposals.push();


        Proposal storage newProposal = proposals[activeProposalId];
        newProposal.name = _name;
        newProposal.description = _description;
        newProposal.execution = _execution;
        newProposal.totalVotes = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;

        for (uint256 i = 0; i < _options.length; i++) {
            newProposal.options.push(PollOption(_options[i], 0));
        }

        emit NewProposal(newId, _name);
    }

    function vote(        uint256 _proposalId,
        address _voter,
        uint256 _optionIndex) external whenNotExpired(_proposalId) {
        Proposal storage proposal = activeProposals[_proposalId];
        require(proposal.votes[_voter] == 0, "Already voted");

        uint256 balance = kubixToken.balanceOf(_voter);
        require(balance > 0, "No KUBID tokens");

        proposal.totalVotes += balance;
        proposal.votes[_voter] = balance;
        proposal.options[_optionIndex].votes += balance;

        emit Voted(activeProposalId, msg.sender, _optionIndex, balance);
    }

    function getWinner() external view returns (string memory) {
        Proposal storage proposal = proposals[activeProposalId];
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

    function endVoting() external onlyDAO {
        require(
            block.timestamp > proposals[activeProposalId].creationTimestamp + proposals[activeProposalId].timeInMinutes * 1 minutes,
            "Voting time not yet expired"
        );

        uint256 winningOptionIndex;
        uint256 highestVotes = 0;
        
        for (uint256 i = 0; i < proposals[activeProposalId].options.length; i++) {
            if (proposals[activeProposalId].options[i].votes > highestVotes) {
                highestVotes = proposals[activeProposalId].options[i].votes;
                winningOptionIndex = i;
            }
        }

        emit ProposalFinished(activeProposalId, winningOptionIndex);
    }

    function getOption(uint256 _proposalId, uint256 _optionIndex)
        public
        view
        returns (string memory optionName, uint256 votes)
    {
        Proposal storage proposal = proposals[_proposalId];
        PollOption storage option = proposal.options[_optionIndex];
        return (option.optionName, option.votes);
    }
    
    function getOptionsCount(uint256 _proposalId) public view returns (uint256) {
        Proposal storage proposal = proposals[_proposalId];
        return proposal.options.length;
    }
}
