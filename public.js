//Get Public Smart Contract Data
const PublicQueue = require("./PublicQueue");
const path = require("path");
const axios = require("axios");
const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const fs = require("fs");
const { infura_API_KEY, PRIVATE_KEY, PUBLIC_KEY } = require("./key");
const pubAbi = PublicQueue.abi;
const addressPub = PublicQueue.networks["3"].address;

console.log(addressPub);
class PublicSM {
  constructor() {
    // Get smart contract address
    const contractHash = addressPub;
    // Get JSON Smart contract absolute path /dirname/PublicQueue.json
    const contractPath = path.resolve(__dirname, "PublicQueue.json");
    // Read the file PublicQueue.json
    const contractInterface = fs.readFileSync(contractPath, "utf-8");
    // Instanciate a web3 Provider
    const web3Provider = infura_API_KEY;
    // Get Smart Contarct ABI
    this._interface = JSON.parse(contractInterface).abi;
    // New Web3
    this._web3 = new Web3();
    // Set Provider
    this._web3.setProvider(new this._web3.providers.HttpProvider(web3Provider));
    // Set Public Key
    this._web3.eth.defaultAccount =
      "0xeffa23a0c2d4fd92b0f3fc5a68b25bb0857998e4";
    // Set Contract Instance
    this._contract = new this._web3.eth.Contract(this._interface, contractHash);

    this._caller = "0xeffa23a0c2d4fd92b0f3fc5a68b25bb0857998e4";

    this._gasLimit = "1000000";
  }
  async getCurrentGasPrices() {
    const response = await axios.get(
      "https://ethgasstation.info/json/ethgasAPI.json"
    );
    const prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };

    return prices;
  }

  get gasLimit() {
    return this._gasLimit;
  }

  async getNonce() {
    let nonce = await this._web3.eth.getTransactionCount(
      this._web3.eth.defaultAccount
    );

    return nonce;
  }

  //   instance.methods
  //         .setTransaction(
  // "0xAA0112a3401Bbb31B0DFa7F68b5b7f79Eb4724F5",
  // "0xEfFA23a0c2D4FD92B0F3fc5A68B25Bb0857998E4",
  // 25
  //         )
  //         .send({ from: accounts[0] });

  sendSignedTransaction(transactionData) {
    return new Promise((resolve, reject) => {
      this.getCurrentGasPrices().then(gasPrices => {
        const gasPrice = gasPrices.low.toString();
        console.log("1");
        // With every new transaction you send using a specific wallet address,
        // you need to increase a nonce which is tied to the sender wallet.
        this._web3.eth
          .getTransactionCount(this._web3.eth.defaultAccount)
          .then(nonce => {
            console.log("2");

            // Generate the transaction
            // IMPORTANT: Gas Limit and Price _MUST_ be numbers or they cause errors
            const txParams = {
              chainId: 3,
              data: transactionData,
              gasLimit: 2100000,
              // convert the gwei price to wei
              gasPrice: Number(this._web3.utils.toWei(gasPrice, "gwei")),
              nonce: this._web3.utils.toHex(nonce),
              to: addressPub,
              value: 0
            };

            const transaction = new Tx(txParams, { chain: "ropsten" });
            const txHash = new Tx(txParams, { chain: "ropsten" }).hash(false);
            transaction.sign(PRIVATE_KEY);
            const serializedTransaction = transaction.serialize();
            console.log(Object.keys(transaction));
            console.log(txHash.toString("hex"));

            const initialTime = Date.now();
            this._web3.eth
              .sendSignedTransaction(
                `0x${serializedTransaction.toString("hex")}`
              )
              .on("receipt", receipt => {
                const endTime = Date.now();
                const elapsedTime = (endTime - initialTime) / 1000;
                console.log(
                  `Transaction #${nonce} using gas price of ${gasPrice} gwei took ${elapsedTime} seconds`
                );
                resolve(receipt);
              })
              .on("error", reject);
          })
          .catch(reject);
      });
    });
  }
}

const pubSM = new PublicSM();

async function setTransaction(data) {
  try {
    const transactionData = pubSM._contract.methods
      .setTransaction(data.sender, data.reciever, data.value)
      .encodeABI();

    await console.log(transactionData, "heyyyyy");
    await pubSM.sendSignedTransaction(transactionData);
  } catch (err) {
    return err;
  }

  return;
}

setTransaction({
  reciever: "0xeffa23a0c2d4fd92b0f3fc5a68b25bb0857998e4",
  sender: "0xeffa23a0c2d4fd92b0f3fc5a68b25bb0857998e4",
  value: 25
}).then(res => console.log(res, "wtf"));
pubSM.getNonce().then(x => console.log(x));
