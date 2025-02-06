// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Contract for creating new tokens
contract TokenFactory is Ownable {
    uint256 public creationFee = 0.1 ether; // Fee to create a new token
    event TokenCreated(address tokenAddress, string name, string symbol);

    constructor() Ownable(msg.sender) {
        // Initialize with deployer as owner
    }

    function setCreationFee(uint256 _fee) external onlyOwner {
        creationFee = _fee;
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient fee");
        
        // Create new token
        CustomToken newToken = new CustomToken(
            name,
            symbol,
            totalSupply,
            msg.sender
        );
        
        emit TokenCreated(address(newToken), name, symbol);
        return address(newToken);
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

// Custom ERC20 token contract
contract CustomToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address tokenOwner
    ) ERC20(name, symbol) {
        _mint(tokenOwner, totalSupply * 10**decimals());
    }
}