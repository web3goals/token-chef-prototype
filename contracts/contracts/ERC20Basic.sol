// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./registry/IRegistry.sol";
import "./sfs/ISFS.sol";

/**
 * @notice A contract with basic ERC20 implementation.
 */
contract ERC20Basic is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address registyAddress,
        address sfsAddress
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        IRegistry(registyAddress).register(msg.sender, "ERC20_BASIC");
        if (sfsAddress != address(0)) {
            ISFS(sfsAddress).register(msg.sender);
        }
    }
}
