// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./registry/IRegistry.sol";

/**
 * @notice A contract with basic ERC20 implementation.
 */
contract ERC20Basic is ERC20 {
    address private _registry;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address tcRegistyAddress,
        address sfsRegistryAddress
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        IRegistry tcRegistry = IRegistry(tcRegistyAddress);
        tcRegistry.register(msg.sender);
        // TODO: Use sfs registry address
    }
}
