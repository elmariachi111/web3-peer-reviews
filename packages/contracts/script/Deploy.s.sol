// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { AntsReviewRoles } from "../src/AntsReviewRoles.sol";

contract DeployScript is Script {
  function setUp() public { }

  function run() public {
    vm.broadcast();
    new Token();
  }
}
