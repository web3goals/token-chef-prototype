// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IRegistry {
    function register(address tokenOwner, string memory tokenType) external;
}
