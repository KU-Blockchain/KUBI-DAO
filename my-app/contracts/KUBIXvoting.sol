pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KubixVoting {
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

    Proposal[] public proposals;

    event NewProposal(uint256 indexed proposalId, string name);

    constructor(address _kubixToken, address _dao) {
        kubixToken = IERC20(_kubixToken);
        dao = _dao;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can call this function");
        _;
    }

    modifier whenNotExpired(uint256 _proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes, "Voting time expired");
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
        require(_maxBalance > _minBalance, "Max balance must be greater than min balance");

        uint256 newId = proposals.length;

        proposals.push();
        Proposal storage newProposal = proposals[newId];
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

    function vote(uint256 _proposalId, address _voter, uint256 _optionIndex) external whenNotExpired(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.votes[_voter] == 0, "Already voted");

        uint256 balance = kubixToken.balanceOf(_voter);
        require(balance > 0, "No KUBIX tokens");
        
        if (balance > proposal.maxBalance) {
            balance = proposal.maxBalance;
        }

        uint256 voteWeight = calculateVoteWeight(_proposalId, balance);

        proposal.totalVotes += voteWeight;
        proposal.votes[_voter] = voteWeight;
        proposal.options[_optionIndex].votes += voteWeight;
    }

    function calculateVoteWeight(uint256 _proposalId, uint256 _balance) public view returns (uint256) {
        Proposal storage proposal = proposals[_proposalId];
        uint256 range = proposal.maxBalance - proposal.minBalance;
        uint256 adjustedBalance = _balance - proposal.minBalance;
        uint256 weight = ((adjustedBalance * (4 - 1)) / range) + 1;
        return weight;
    }

    function getWinner(uint256 _proposalId) external view returns (string memory) {
        Proposal storage proposal = proposals[_proposalId];

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
}