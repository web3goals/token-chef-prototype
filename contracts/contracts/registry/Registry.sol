// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IRegistry.sol";

/**
 * @notice A contract that stores account contracts.
 */
contract Registry is IRegistry {
    mapping(address account => address[] contracts) private _accountContracts;

    constructor() {}

    /// **************************
    /// ***** USER FUNCTIONS *****
    /// **************************
    function register(address recipient) external {
        address accountContract = msg.sender;
        _accountContracts[recipient].push(accountContract);
    }

    /// ***********************************
    /// ***** EXTERNAL VIEW FUNCTIONS *****
    /// ***********************************

    function getContracts(
        address account
    ) external view returns (address[] memory contracts) {
        return _accountContracts[account];
    }
}
