//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNFT is ERC721 {
    string private constant c_tokenURI = "http://127.0.0.1:8080/ipfs/QmVFqChWxYsjqiDJQ7JHXU59cHCdBKUrbS7zaCptHc3E9E/";
    uint256 private tokenCounter;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        tokenCounter = 0;
    }

    function mintDOG() public returns (uint256) {
        _safeMint(msg.sender, tokenCounter);
        tokenCounter += 1;
        return tokenCounter;
    }

    function tokenURI() public pure returns (string memory) {
        return c_tokenURI;
    }

    function getTokenCounter() public view returns (uint256) {
        return tokenCounter;
    }
}
