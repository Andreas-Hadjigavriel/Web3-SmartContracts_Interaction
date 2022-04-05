const express               = require('express')
const path                  = require('path')
const app                   = express()
const fs                    = require('fs')
var Tx                      = require('ethereumjs-tx').Transaction
var crypto                  = require('crypto')

/* ------------------------- Blockchain Init ------------------------------------- */
const Web3                  = require('web3');
const ethNetwork            = 'https://ropsten.infura.io/v3/e334871203b44ac5a3cffd0bbb405060'
const web3                  = new Web3(new Web3.providers.HttpProvider(ethNetwork))

const devAccount            = '0x453264bA6b8Bc1d071ccc5cce3661F3339A0cE1c'
web3.eth.defaultAccount     = devAccount
const devPrivateKey         = "19318b8634925ea867dede4398155e6d0f9b44258a7dc78dd93c58bf0b5491ea"
const privateKey1Buffer     = Buffer.from(devPrivateKey, 'hex')

// Smart Contract's ABIs 
const routesABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_date",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_time",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_driverName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_routeBinId",
        "type": "string"
      }
    ],
    "name": "setRouteData",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getRouteData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "date",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "time",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "driverName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "routeBinId",
            "type": "string"
          }
        ],
        "internalType": "struct Routes.Route[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
const wastesABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_date",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_time",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_driverName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_route",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_binID",
        "type": "string"
      }
    ],
    "name": "setWasteData",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getWasteData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "date",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "time",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "driverName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "route",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "binID",
            "type": "string"
          }
        ],
        "internalType": "struct Wastes.Waste[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]

const routesContractAddress = "0x8274A2873CC19a9Fb11BFB08E54d35D5c0aA6e57"
const wastesContractAddress = "0x370f10971EfD290B9DE27cFE3b0bc3278d81F2d3"



/* ------------------------------- FUNCTIONS ------------------------------------ */

// Set Waste Data to Blockchain Function
const setWasteData = async (wasteDate,wasteTime,wasteDriverName,wasteLocation,wasteRoute,wasteBinID) => {

  // instantiate the contract 
  const myContract = await new web3.eth.Contract(wastesABI, wastesContractAddress) 
  // call setWasteData function from Wastes Smart Contract
  const myData = await myContract.methods.setWasteData(
                wasteDate,wasteTime,wasteDriverName,wasteLocation,wasteRoute,wasteBinID)
                .encodeABI();
  
  await web3.eth.getTransactionCount(devAccount, async (err, txCount) => {
      // Build the transaction
      const txObject = {
          nonce:    web3.utils.toHex(txCount),
          to:       wastesContractAddress,
          value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
          gasLimit: web3.utils.toHex(2100000),
          gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
          data: myData  
      }
      // Sign the transaction
      const tx = new Tx(txObject,{ chain: 'ropsten' });
      tx.sign(privateKey1Buffer);
  
      const serializedTx = tx.serialize();
      const raw = '0x' + serializedTx.toString('hex');

      // Broadcast the transaction
      await web3.eth.sendSignedTransaction(raw, (err, tx) => {
          console.log("Set Data Transaction Hash:", tx)
          console.log("Set Data Error:", err)
          if (tx != null){
              console.log("Transaction success")
          } else {
            console.log("Send transaction again")
          }
      });
  });        
}
// Get Waste Data from Blockchain Function
const getWasteData = async () => {
  const myContract = await new web3.eth.Contract(wasteABI, wastesContractAddress)  

  const getData = await myContract.methods.getWasteData().call()
  console.log("---------------")
  console.log(getData)
}

// Set Waste Data to Blockchain Function
const setRouteData = async (routeDate, routeTime, routeDriverName, routeLocation, routeBinId) => {

  // instantiate the contract 
  const myContract = await new web3.eth.Contract(routesABI, routesContractAddress) 
  // call setWasteData function from Wastes Smart Contract
  const myData = await myContract.methods.setRouteData(
                routeDate, routeTime, routeDriverName, routeLocation, routeBinId)
                .encodeABI();

  await web3.eth.getTransactionCount(devAccount, async (err, txCount) => {
    // Build the transaction
    const txObject = {
      nonce:    web3.utils.toHex(txCount),
      to:       routesContractAddress,
      value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
      gasLimit: web3.utils.toHex(2100000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
      data: myData  
    }
    // Sign the transaction
    const tx = new Tx(txObject,{ chain: 'ropsten' });
    tx.sign(privateKey1Buffer);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    // Broadcast the transaction
    await web3.eth.sendSignedTransaction(raw, (err, tx) => {
      console.log("Set Data Transaction Hash:", tx)
      console.log("Set Data Error:", err)
      if (tx != null){
        console.log("Transaction success")
      } else {
        console.log("Send transaction again")
      }
    })
  })       
}
// Get Route Data from Blockchain Function
const getRouteData = async () => {
  const myContract = await new web3.eth.Contract(routeABI, routesContractAddress)  

  const getData = await myContract.methods.getRouteData().call()
  console.log("---------------")
  console.log(getData)
}

/* ----------------------------- STORE DATA TO BLOCKCHAIN ------------------------------- */

var date = "2021-12-01 00:00"
const toTimestamp = (strDate) => { const dt = new Date(strDate).getTime(); return dt / 1000; } 
const wasteDate = toTimestamp(date)
const wasteTime = "20:30"
const wasteDriverName = "Andreas"
const wasteLocation = "Palaio Faliro 12"
const wasteRoute = "Nea Smirni - Palaio Faliro 12"
const wasteBinID = "1" 

setWasteData(wasteDate,wasteTime,wasteDriverName,wasteLocation,wasteRoute,wasteBinID)

var date1 ="2021-12-01 00:00"
const toTimestamp1 = (strDate) => { const dt = new Date(strDate).getTime(); return dt / 1000; } 
const routeDate = toTimestamp1(date1)
const routeTime ="20:00"
const routeDriverName = "Andreas"
const routeLocation = "Nea Smirni 1"
const routeBinId = "22"

//setRouteData(routeDate, routeTime, routeDriverName, routeLocation, routeBinId)




/* -------------------------- FETCHING DATA FROM BLOCHCHAIN ------------------------------ */

// Fetch Data from BChain
//getWasteData();
//getRouteData()








