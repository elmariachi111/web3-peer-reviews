// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { AntsReview } from "../src/AntsReview.sol";

contract DeployScript is Script {
  function setUp() public { }

  function run() public {
    address orcidAddr = vm.envAddress("ORCID_ADDRESS");
    vm.broadcast();
    new AntsReview(orcidAddr);
  }
}
