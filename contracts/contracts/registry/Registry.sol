// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IRegistry.sol";

/**
 * @notice A contract that stores account token contracts.
 */
contract Registry is IRegistry {
    mapping(address account => address[] tokens) private _accountTokens;
    mapping(address token => string tokenType) private _tokenTypes;

    constructor() {}

    /// **************************
    /// ***** USER FUNCTIONS *****
    /// **************************
    function register(address tokenOwner, string memory tokenType) external {
        address tokenContract = msg.sender;
        _accountTokens[tokenOwner].push(tokenContract);
        _tokenTypes[tokenContract] = tokenType;
    }

    /// ***********************************
    /// ***** EXTERNAL VIEW FUNCTIONS *****
    /// ***********************************

    function getTokens(
        address account
    ) external view returns (address[] memory tokens) {
        return _accountTokens[account];
    }

    function getTokenType(
        address token
    ) external view returns (string memory tokenType) {
        return _tokenTypes[token];
    }
}
