# Contracts
requirements: getforge.sh

`yarn typechain && yarn build` -> exports typechain types

deploy orcid (see other repo)
yarn hardhat run scripts/deploy.js --network anvil

deploy antreview contract
ORCID_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3 forge script --rpc-url http://127.0.0.1:8545 script/Deploy.s.sol --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

issue yourself an orcid mapping

cast send --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 <reviewcontract> "issue(address,string)" <addr> <ocrid>





ETHERSCAN_API_KEY=... forge verify-contract --chain-id 80001 0xe0D404C22228b03D5b8a715Cb569C4944BC5A27A AntsReview

public orcid address on mumbai: 0x74a58601b3765516196EBF7db47A1959eD886097
local orcid address (changes): 0x5FbDB2315678afecb367f032d93F642f64180aa3
