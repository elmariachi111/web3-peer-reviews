// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Pausable } from "@openzeppelin/contracts/security/Pausable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract Token is ERC721, Ownable {
  using Strings for uint256;

  uint256 immutable TOKEN_COUNT = 1000;

  string baseUri = "http://localhost:3000/api/metadata/";

  uint256 public nextTokenId = 1;

  constructor() ERC721("SampleToken", "STOKEN") Ownable() { }

  function setBaseURI(string memory baseUri_) public onlyOwner {
    baseUri = baseUri_;
  }

  function safeMint(address to) public {
    uint256 curTokenId = nextTokenId;
    nextTokenId = nextTokenId + 1;
    _safeMint(to, curTokenId);
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    return string(abi.encodePacked(baseUri, tokenId.toString()));
  }
}
