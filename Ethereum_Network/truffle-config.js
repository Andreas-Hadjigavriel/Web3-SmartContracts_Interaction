const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
//const privateKey = fs.readFileSync(".secret").toString().trim();
const privateKey = '19318b8634925ea867dede4398155e6d0f9b44258a7dc78dd93c58bf0b5491ea';
const infuraURL = "https://ropsten.infura.io/v3/e334871203b44ac5a3cffd0bbb405060";
const moonbaseAPI = "https://moonbeam-alpha.api.onfinality.io/public";

module.exports = {
  //contracts_build_directory: './contracts',
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545, 
     network_id: "*",
    },
    ropsten: { // run: truffle migrate -f 2 --to 2 --network ropsten (2: migration initial number)
      provider: () => new HDWalletProvider(privateKey, infuraURL),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    moonbase: {
      provider: () => new HDWalletProvider(privateKey, moonbaseAPI)
    }
  }
};