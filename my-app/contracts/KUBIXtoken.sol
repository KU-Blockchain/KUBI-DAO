pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KUBIX is ERC20, Ownable {
    mapping(address => uint256) private _balances;

    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor() ERC20("KUBIX Participation Token", "KUBIX") {
        _name = "KUBIX Participation Token";
        _symbol = "KUBIX";
        _decimals = 18;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function _mint(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        revert("KUBIX: transfers are disabled");
    }
}