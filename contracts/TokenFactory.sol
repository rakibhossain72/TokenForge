// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory is Ownable {
    event TokenCreated(address tokenAddress, string name, string symbol, uint256 supply, address creator);
    uint256 public creationFee = 0.001 ether;
    address public feeReceiver;

    constructor() Ownable(msg.sender) {
        feeReceiver = msg.sender;
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply
    ) external payable returns (address tokenAddress) {
        require(msg.value < creationFee, "Insufficient fee");
        
        // Gas optimization: Create2 with salt based on creator address
        bytes32 salt = keccak256(abi.encode(msg.sender, name, symbol));
        ERC20Token newToken = new ERC20Token{salt: salt}(
            name,
            symbol,
            totalSupply,
            msg.sender
        );
        
        payable(feeReceiver).transfer(msg.value);
        emit TokenCreated(address(newToken), name, symbol, totalSupply, msg.sender);
        return address(newToken);
    }

    function setFee(uint256 _fee) external onlyOwner {
        creationFee = _fee;
    }

    function setFeeReceiver(address _receiver) external onlyOwner {
        feeReceiver = _receiver;
    }
}

contract ERC20Token is ERC20 {
    // Gas optimizations:
    // - Remove Ownable (saves ~5k gas per deployment)
    // - Precompute decimals (saves ~200 gas per deployment)
    // - Pack constructor parameters
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address creator
    ) ERC20(name, symbol) {
        // Use fixed 18 decimals instead of dynamic decimals() call
        _mint(creator, totalSupply * 1e18);
    }
}