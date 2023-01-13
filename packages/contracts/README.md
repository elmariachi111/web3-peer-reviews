# Contracts
requirements: getforge.sh

`yarn typechain && yarn build` -> exports typechain types

forge script --rpc-url http://127.0.0.1:8545 script/Deploy.s.sol --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

ETHERSCAN_API_KEY=... forge verify-contract --chain-id 80001 0xe0D404C22228b03D5b8a715Cb569C4944BC5A27A AntsReview
