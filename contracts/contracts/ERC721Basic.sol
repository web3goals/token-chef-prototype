// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./registry/IRegistry.sol";
import "./sfs/ISFS.sol";

/**
 * @notice A contract with basic ERC721 implementation.
 */
contract ERC721Basic is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor(
        string memory name,
        string memory symbol,
        address registyAddress,
        address sfsAddress
    ) ERC721(name, symbol) Ownable(msg.sender) {
        safeMint(msg.sender);
        IRegistry(registyAddress).register(msg.sender, "ERC721_EXTENDED");
        if (sfsAddress != address(0)) {
            ISFS(sfsAddress).register(msg.sender);
        }
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}
