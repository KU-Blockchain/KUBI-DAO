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

    Proposal[] private proposals;

    event NewProposal(uint256 indexed proposalId, string name, string description, string execution);
    event Voted(uint256 indexed proposalId, address indexed voter, uint256 optionIndex);
    event PollOptionNames(uint256 indexed proposalId, uint256 indexed optionIndex, string name);

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
    }

    function addOwner(address _newOwner) public onlyOwner {
        isOwner[_newOwner] = true;
    }

    function removeOwner(address _owner) public onlyOwner {
        isOwner[_owner] = false;
    }

    modifier whenNotExpired(uint256 _proposalId) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes, "Voting time expired");
        _;
    }

    function createProposal(
        string memory _name,
        string memory _description,
        string memory _execution,
        uint256 _timeInMinutes,
        string[] memory _optionNames
    ) external onlyOwner {
        Proposal storage newProposal = proposals.push();
        newProposal.totalVotes = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;

        uint256 proposalId = proposals.length - 1;
        emit NewProposal(proposalId, _name, _description, _execution);

        for (uint256 i = 0; i < _optionNames.length; i++) {
            newProposal.options.push(PollOption(0));
            emit PollOptionNames(proposalId, i, _optionNames[i]);
        }
    }

    function vote(
        uint256 _proposalId,
        address _voter,
        uint256 _optionIndex
    ) external whenNotExpired(_proposalId) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.hasVoted[_voter], "Already voted");

        uint256 balance = kubidToken.balanceOf(_voter);
        require(balance > 0, "No KUBID tokens");
        proposal.hasVoted[_voter] = true;
        proposal.totalVotes += 1;
        proposal.options[_optionIndex].votes += 1;

        emit Voted(_proposalId, _voter, _optionIndex);
    }

    function getWinner(uint256 _proposalId) external view returns (uint256 winningOptionIndex) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        uint256 highestVotes = 0;

        for (uint256 i = 0; i < proposal.options.length; i++) {
            if (proposal.options[i].votes > highestVotes) {
                highestVotes = proposal.options[i].votes;
                winningOptionIndex = i;
            }
        }
    }

    function getOptionsCount(uint256 _proposalId) public view returns (uint256) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        return proposal.options.length;
    }

    function getOptionVotes(uint256 _proposalId, uint256 _optionIndex)
        public
        view
        returns (uint256 votes)
    {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(_optionIndex < proposal.options.length, "Invalid option index");
        return proposal.options[_optionIndex].votes;
    }
}
