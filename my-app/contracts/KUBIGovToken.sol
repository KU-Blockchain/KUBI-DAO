
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KUBIExecutiveNFT is Ownable, ERC721 {
    mapping(uint256=>uint256) nftToTerm;
    mapping(address=>uint256) ExecToNFT; 
    
    uint256 tokenIds=0;

    string baseTokenURI;

    constructor(string memory _baseTokenURI) ERC721("KUBIExecutive", "KUBIEx"){
        baseTokenURI=_baseTokenURI;
    }

    function mint(address _address) public onlyOwner{
        tokenIds += 1;
        _safeMint(_address, tokenIds);
        require(ownerOf(tokenIds)==_address, "NFT Failed to Mint");
        nftToTerm[tokenIds]=block.timestamp;
        ExecToNFT[_address]=tokenIds;
    }
    function getTermLimit(address _address)public view returns(uint256){
        uint256 nft = ExecToNFT[_address];
        uint256 startTime = nftToTerm[nft];
        return startTime + 31536000;
    }

    function transferFrom(address /*from*/, address /*to*/, uint256 /*tokenId*/) public override pure {
        revert("This token is non-transferable");
    }

    function approve(address /*to*/, uint256 /*tokenId*/) public override pure {
        revert("This token is non-allowable");
    }

    function setApprovalForAll(address /*operator*/, bool /*approved*/) public override pure {
        revert("This token is non-allowable");
    }

}