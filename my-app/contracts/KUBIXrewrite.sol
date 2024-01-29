// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KUBIX is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("KUBIX Participation Token", "KUBIX") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender); 
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "KUBIX: must have minter role to mint");
        require(to != address(0), "KUBIX: mint to the zero address");
        _mint(to, amount);
    }

    function grantMinterRole(address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "KUBIX: must have admin role to grant");
        grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "KUBIX: must have admin role to revoke");
        revokeRole(MINTER_ROLE, account);
    }

    function _transfer(
            address sender,
            address recipient,
            uint256 amount
        ) internal override {
            revert("KUBIX: transfers are disabled");
        }
    
}
