// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract Lock {
    address private usdc_address;
    address private usdt_address;
    address public admin; // To handle admin functions, potentially a multi-sig or DAO
    mapping(address => uint256) public lockedAmounts; // Mapping of locked USDC per user

    event Locked(address indexed user, uint256 amount);

    constructor(address _usdc_addr, address _usdt_addr) {
        usdc_address = _usdc_addr;
        usdt_address = _usdt_addr;
    }

    function lockUSDC(uint256 amount) external {
        require(amount > 0, "Amount should be greater than 0");

        // Transfer USDC to this contract (assumes ERC20 compatible USDC on Polygon)
        IERC20(usdc_address).transferFrom(msg.sender, address(this), amount);

        // Update locked amount
        lockedAmounts[msg.sender] += amount;

        emit Locked(msg.sender, amount);
    }
    // Other functions like admin logic, updating USDC address, etc. can be added
}
