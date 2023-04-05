
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DirectDemocracyToken is ERC20{
    uint256 public constant maxSupplyPerPerson= 100;

    constructor() ERC20("KUBIDem", "KUBID"){

    }

    function mint() public {
        require(balanceOf(msg.sender)==0, "You Have Already Claimed Your Coins!"  );
        _mint(msg.sender, maxSupplyPerPerson);
        require(balanceOf(msg.sender)==maxSupplyPerPerson, "Coins failed to mint");
    }
    function getBalance(address _address)public view returns(uint256){
        return balanceOf(_address);
    }
    function transfer(address /*to*/, uint256 /*amount*/)public virtual override returns(bool){
        revert("Transfer of tokens is not allowed");
    }

    

    function approve(address /*spender*/, uint256 /*amount*/) public virtual override returns (bool){
        revert("Approval of Token allowance is not allowed");
    }

    function transferFrom(address /*from*/, address /*to*/, uint256 /*amount*/) public virtual override returns (bool){
        revert("Transfer of Tokens is not allowed");
    }

