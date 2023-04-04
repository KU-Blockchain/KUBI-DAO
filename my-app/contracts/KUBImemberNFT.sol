pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KUBIMembershipNFT is ERC721URIStorage, Ownable {
    // Define the NFT structure
    struct Member {
        uint256 id;
        uint256 schoolYear;
        uint256 tier;
    }

    // Mapping of address to Member
    mapping(address => Member) private _members;

    // Mapping of address to boolean (to check if they already own an NFT)
    mapping(address => bool) private _hasMembership;

    // Current token ID
    uint256 private _currentTokenId;

    // Constructor
    constructor() ERC721("MembershipNFT", "MNFT") {
        _currentTokenId = 1;
    }

    // Function to mint a new Membership NFT
    function mintMembershipNFT(
        address to,
        uint256 schoolYear,
        uint256 tier,
        string memory ipfsLink
    ) public onlyOwner {
        require(!_hasMembership[to], "Each account can only own one Membership NFT");
        uint256 newTokenId = _currentTokenId;
        _currentTokenId += 1;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, ipfsLink);
        _members[to] = Member(newTokenId, schoolYear, tier);
        _hasMembership[to] = true;
    }

    // Function to get the details of a Membership NFT by owner address
    function getMembershipDetails(address owner)
        public
        view
        returns (
            uint256 id,
            uint256 schoolYear,
            uint256 tier
        )
    {
        Member memory member = _members[owner];
        return (member.id, member.schoolYear, member.tier);
    }

    // Override the transfer functions to make the NFT non-transferable
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        revert("Membership NFTs are non-transferable");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Membership NFTs are non-transferable");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        revert("Membership NFTs are non-transferable");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Membership NFTs are non-transferable");
    }
}
