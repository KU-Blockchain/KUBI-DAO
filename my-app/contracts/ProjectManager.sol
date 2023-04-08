pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProjectManager is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private projectIdCounter;

    struct Project {
        uint256 id;
        string ipfsHash;
    }

    mapping(uint256 => Project) public projects;

    event ProjectCreated(uint256 indexed projectId, string ipfsHash);
    event ProjectUpdated(uint256 indexed projectId, string newIpfsHash);

    constructor() ERC721("ProjectManager", "PM") {}

    function createProject(string memory ipfsHash) public onlyOwner {
        projectIdCounter.increment();
        uint256 newProjectId = projectIdCounter.current();
        projects[newProjectId] = Project(newProjectId, ipfsHash);
        emit ProjectCreated(newProjectId, ipfsHash);
    }

    function updateProject(uint256 projectId, string memory newIpfsHash) public onlyOwner {
        require(bytes(projects[projectId].ipfsHash).length > 0, "Project not found");
        projects[projectId].ipfsHash = newIpfsHash;
        emit ProjectUpdated(projectId, newIpfsHash);
    }

    function getProjectIdCounter() public view returns (uint256) {
        return projectIdCounter.current();
    }

}
