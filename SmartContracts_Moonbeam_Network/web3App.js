/* -------------------------------------------------------------------------------------- */
/*                                                                                        */
/*                                 INITIALIZATIONS                                        */
/*                                                                                        */
/* -------------------------------------------------------------------------------------- */
const express               = require('express')
const path                  = require('path')
const app                   = express()
const fs                    = require('fs')

const Web3                  = require('web3');
const moonBeamNetwork       = 'https://moonbeam-alpha.api.onfinality.io/public'
const web3                  = new Web3(new Web3.providers.HttpProvider(moonBeamNetwork))

const devAccount            = '0x453264bA6b8Bc1d071ccc5cce3661F3339A0cE1c'
web3.eth.defaultAccount     = devAccount
const devPrivateKey         = "19318b8634925ea867dede4398155e6d0f9b44258a7dc78dd93c58bf0b5491ea"

const routesContractAddress = "0x7c45B828abF084D72BC6976AC7a59b1D60B8117a"
const wastesContractAddress = "0xc3856f8685ff38fdcc20c904758805f0ee1310a2"

// Smart Contract's ABIs 
var routesAbiJsonFile = fs.readFileSync('build/contracts/Routes.json', 'utf8')
routesAbiJsonFile = JSON.parse(routesAbiJsonFile)
const routesABI = routesAbiJsonFile.abi;

var wastesAbiJsonFile = fs.readFileSync('build/contracts/Wastes.json', 'utf8')
wastesAbiJsonFile = JSON.parse(wastesAbiJsonFile)
const wastesABI = wastesAbiJsonFile.abi;


/* -------------------------------------------------------------------------------------- */
/*                                                                                        */
/*                   STORE/SET DATA TO BLOCKCHAIN (SMART CONTRACTS)                       */
/*                                                                                        */
/* -------------------------------------------------------------------------------------- */
// Set Waste Data to Blockchain Function
const setWasteData = async (wasteDate,wasteTime,wasteDriverName,wasteLocation,wasteRoute,wasteBinID) => {

        const myContract = new web3.eth.Contract(wastesABI);
        const myData = myContract.methods.setWasteData(wasteDate,wasteTime,wasteDriverName,wasteLocation,wasteRoute,wasteBinID).encodeABI()

        const mycontract = async() => {
            const createTransaction = await web3.eth.accounts.signTransaction({
                from: devAccount,
                to: wastesContractAddress,
                data: myData,
                value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
                gasLimit: web3.utils.toHex(2100000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
            }, devPrivateKey)
            const createReceipt = await web3.eth.sendSignedTransaction(
                createTransaction.rawTransaction
            );
            console.log("Transaction Hash:", createReceipt.transactionHash)
        }
        mycontract()
}

// Set Waste Data to Blockchain Function
const setRouteData = async (routeDate, routeTime, routeDriverName, routeLocation, routeBinId) => {
    const myContract1 = new web3.eth.Contract(routesABI);
    const myData1 = myContract1.methods.setRouteData(routeDate, routeTime, routeDriverName, routeLocation, routeBinId).encodeABI()

    const mycontract1 = async() => {
        const createTransaction = await web3.eth.accounts.signTransaction({
            from: devAccount,
            to: routesContractAddress,
            data: myData1,
            value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
            gasLimit: web3.utils.toHex(2100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
        }, devPrivateKey)
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
        console.log("Transaction Hash:", createReceipt.transactionHash)
    }
    mycontract1()
}

/* ---------------------------------- WASTES -------------------------------------------- */

var date = "2021-12-01 00:00"
const toTimestamp = (strDate) => { const dt = new Date(strDate).getTime(); return dt / 1000; } 
const wasteDate = toTimestamp(date)
const wasteTime = "20:30"
const wasteDriverName = "Andreas"
const wasteLocation = "Palaio Faliro 12"
const wasteRoute = "Nea Smirni - Palaio Faliro 12"
const wasteBinID = "1" 

//setWasteData(wasteDate,wasteTime,wasteDriverName,wasteLocation,wasteRoute,wasteBinID)

/* ---------------------------------- ROUTES -------------------------------------------- */

var date1 ="2021-12-01 00:00"
const toTimestamp1 = (strDate) => { const dt = new Date(strDate).getTime(); return dt / 1000; } 
const routeDate = toTimestamp1(date1)
const routeTime ="20:00"
const routeDriverName = "Andreas"
const routeLocation = "Nea Smirni 1"
const routeBinId = "22"

//setRouteData(routeDate, routeTime, routeDriverName, routeLocation, routeBinId)



/* -------------------------------------------------------------------------------------- */
/*                                                                                        */
/*                           FETCHING DATA FROM BLOCKCHAIN                                */
/*                                                                                        */
/* -------------------------------------------------------------------------------------- */

// Get Waste Data from Blockchain Function
const getWasteData = async () => {
    const myWasteContract = await new web3.eth.Contract(wastesABI, wastesContractAddress)  
  
    const getData = await myWasteContract.methods.getWasteData().call()
    console.log(getData)
    console.log("---------------")
}

// Get Route Data from Blockchain Function
const getRouteData = async () => {
    const myRouteContract = await new web3.eth.Contract(routesABI, routesContractAddress)  
  
    const getData1 = await myRouteContract.methods.getRouteData().call()
    console.log(getData1)
    console.log("---------------")
  }

const fetchData = async () => {
    // Fetch Data from BChain
    console.log("-- Waste Data --")
    await getWasteData();
    console.log("-- Route Data --")
    await getRouteData()
}; fetchData()







