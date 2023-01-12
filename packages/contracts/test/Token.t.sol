// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test } from "forge-std/Test.sol";
import { Token } from "../src/Token.sol";

contract TokenTest is Test {
  Token public erc721;

  address alice = makeAddr("alice");
  address bob = makeAddr("bob");

  function setUp() public {
    erc721 = new Token();
    erc721.setBaseURI("ipfs://QmAbcdef/");
  }

  function testMint() public {
    erc721.safeMint(alice);
    assertEq(erc721.ownerOf(1), alice);
  }

  function testTransfer() public {
    erc721.safeMint(alice);
    vm.prank(alice);
    erc721.safeTransferFrom(alice, bob, 1);
    assertEq(erc721.ownerOf(1), bob);
    vm.stopPrank();
  }
}
