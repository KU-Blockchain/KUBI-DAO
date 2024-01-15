pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KubidVoting {
    IERC20 public kubidToken;
    address public dao;

    struct PollOption {
        uint256 votes;
    }

    struct Proposal {
        uint256 totalVotes;
        mapping(address => bool) hasVoted;
        uint256 timeInMinutes;
        uint256 creationTimestamp;
        PollOption[] options;
    }

    Proposal[] private activeProposals;
    uint256[] public activeProposalIndices;
    uint256[] public completedProposalIndices;

    event NewProposal(uint256 indexed proposalId, string name, string description, string execution);
    event Voted(uint256 indexed proposalId, address indexed voter, uint256 optionIndex);
    event ProposalCompleted(uint256 indexed proposalId);

    mapping(address => bool) public isOwner;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Caller is not an owner");
        _;
    }

    constructor(address _kubidToken, address _dao, address _owner1, address _owner2) {
        kubidToken = IERC20(_kubidToken);
        dao = _dao;
        isOwner[msg.sender] = true;
        isOwner[_owner1] = true;
        isOwner[_owner2] = true;
        activeProposalIndices.push(0); 
    }

    function addOwner(address _newOwner) public onlyOwner {
        isOwner[_newOwner] = true;
    }

    function removeOwner(address _owner) public onlyOwner {
        isOwner[_owner] = false;
    }

    modifier whenNotExpired(uint256 _proposalId) {
        Proposal storage proposal = activeProposals[_proposalId];
        require(block.timestamp <= proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes, "Voting time expired");
        _;
    }

    function createProposal(
        string memory _name,
        string memory _description,
        string memory _execution,
        uint256 _timeInMinutes
    ) external onlyOwner {
        uint256 newId = activeProposals.length;
        activeProposalIndices.push(newId);
        activeProposals.push();

        Proposal storage newProposal = activeProposals[newId];
        newProposal.totalVotes = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;

        emit NewProposal(newId, _name, _description, _execution);
    }

    function addOptions(uint256 _proposalId, uint256 _optionsCount) external onlyOwner {
        Proposal storage proposal = activeProposals[_proposalId];
        for (uint256 i = 0; i < _optionsCount; i++) {
            proposal.options.push(PollOption(0));
        }
    }

    function vote(uint256 _proposalId, uint256 _optionIndex) external whenNotExpired(_proposalId) {
        Proposal storage proposal = activeProposals[_proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 balance = kubidToken.balanceOf(msg.sender);
        require(balance > 0, "No KUBID tokens");
        proposal.hasVoted[msg.sender] = true;
        proposal.totalVotes += 1;
        proposal.options[_optionIndex].votes += 1;
        
        emit Voted(_proposalId, msg.sender, _optionIndex);
    }

    function getWinner(uint256 _completedProposalIndex) external view returns (uint256 winningOptionIndex) {
        uint256 _completedProposalId = completedProposalIndices[_completedProposalIndex];
        Proposal storage proposal = activeProposals[_completedProposalId];
        uint256 highestVotes = 0;

        for (uint256 i = 0; i < proposal.options.length; i++) {
            if (proposal.options[i].votes > highestVotes) {
                highestVotes = proposal.options[i].votes;
                winningOptionIndex = i;
            }
        }
    }

    function moveToCompleted() public onlyOwner {
        uint256 i = 1;
        while (i < activeProposalIndices.length) {
            uint256 proposalId = activeProposalIndices[i];
            Proposal storage proposal = activeProposals[proposalId];
            if (block.timestamp > proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes) {
                completedProposalIndices.push(proposalId);
                emit ProposalCompleted(proposalId);
                removeProposalIndex(i);
            } else {
                i++;
            }
        }
    }

    function removeProposalIndex(uint256 index) private {
        for (uint256 j = index; j < activeProposalIndices.length - 1; j++) {
            activeProposalIndices[j] = activeProposalIndices[j + 1];
        }
        activeProposalIndices.pop();
    }

    function activeProposalsCount() public view returns (uint256) {
        return activeProposalIndices.length - 1;
    }

    function completedProposalsCount() public view returns (uint256) {
        return completedProposalIndices.length;
    }

    function getOption(uint256 _proposalId, uint256 _optionIndex)
        public
        view
        returns (uint256 votes)
    {
        Proposal storage proposal = activeProposals[_proposalId];
        PollOption storage option = proposal.options[_optionIndex];
        return option.votes;
    }

    function getOptionsCount(uint256 _proposalId) public view returns (uint256) {
        Proposal storage proposal = activeProposals[_proposalId];
        return proposal.options.length;
    }

}