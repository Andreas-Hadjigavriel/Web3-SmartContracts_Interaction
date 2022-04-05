Steps:
- truffle init // initialize the project
- Smart Contracts inside contracts folder
- Adding Migration Files for each smart contract in migration folder

Deploy (ropsten testnet network):
- #truffle compile
- #truffle migrate -f 2 --to 2 --network ropsten // (2 = migration initial number)

Run the web3 App:
- #node web3app.js