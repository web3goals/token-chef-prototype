// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ISFS {
    function register(address _recipient) external returns (uint256 tokenId);
}
