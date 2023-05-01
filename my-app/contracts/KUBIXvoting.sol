pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KubixVoting {
    IERC20 public kubixToken;
    address public dao;

    struct Proposal {
        string name;
        string description;
        string execution;
        uint256 totalVotes;
        mapping(address => uint256) votes;
        bool isPoll;
        uint256 maxBalance;
        uint256 minBalance;
    }


    Proposal[] public proposals;

    event NewProposal(uint256 indexed proposalId, string name, bool isPoll);

    constructor(address _kubixToken, address _dao) {
        kubixToken = IERC20(_kubixToken);
        dao = _dao;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can call this function");
        _;
    }

function createProposal(
    string memory _name,
    string memory _description,
    string memory _execution,
    bool _isPoll,
    uint256 _maxBalance,
    uint256 _minBalance
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
    newProposal.isPoll = _isPoll;
    newProposal.maxBalance = _maxBalance;
    newProposal.minBalance = _minBalance;

    emit NewProposal(newId, _name, _isPoll);
}




    function vote(uint256 _proposalId, address _voter) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.votes[_voter] == 0, "Already voted");

        uint256 balance = kubixToken.balanceOf(_voter);
        require(balance > 0, "No KUBIX tokens");

        uint256 voteWeight = calculateVoteWeight(_proposalId, balance);

        proposal.totalVotes += voteWeight;
        proposal.votes[_voter] = voteWeight;
    }


    function calculateVoteWeight(uint256 _proposalId, uint256 _balance) public view returns (uint256) {
        Proposal storage proposal = proposals[_proposalId];
        uint256 range = proposal.maxBalance - proposal.minBalance;
        uint256 adjustedBalance = _balance - proposal.minBalance;
        uint256 weight = ((adjustedBalance * (4 - 1)) / range) + 1;
        return weight;
    }

}
