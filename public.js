//Get Public Smart Contract Data
const path = require("path");
const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const fs = require("fs");

const PublicQueue = require("./PublicQueue");
const { infura_API_KEY, PRIVATE_KEY, PUBLIC_KEY } = require("./key");

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
      "0xABB9C12f2eE29c58147ea72F5c8eF4C0e23295e8";
    // Set Contract Instance
    this._contract = new this._web3.eth.Contract(this._interface, contractHash);

    this._caller = "0xABB9C12f2eE29c58147ea72F5c8eF4C0e23295e8";

    this._gasLimit = "1000000";
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

  sendSignedTransaction(transactionData) {
    return new Promise((resolve, reject) => {
      // With every new transaction you send using a specific wallet address,
      // you need to increase a nonce which is tied to the sender wallet.
      this._web3.eth
        .getTransactionCount(this._web3.eth.defaultAccount)
        .then(nonce => {
          // Generate the transaction
          const txParams = {
            data: transactionData,
            gasLimit: this._web3.utils.toHex(800000),
            // convert the gwei price to wei
            gasPrice: this._web3.utils.toHex(
              this._web3.utils.toWei("10", "gwei")
            ),
            nonce: this._web3.utils.toHex(nonce),
            to: addressPub,
            value: this._web3.utils.toHex("0")
          };

          const transaction = new Tx(txParams, { chain: "ropsten" });
          transaction.sign(
            Buffer.from(
              "b1e185c6d7e7448946d5c8a94215fae717a9a29eb087a3e852b4917ce002fb4c",
              "hex"
            )
          );
          const serializedTransaction = transaction.serialize();
          const raw = "0x" + serializedTransaction.toString("hex");

          // Sign Tx

          const initialTime = Date.now();

          // Broadcast the transaction
          this._web3.eth
            .sendSignedTransaction(raw)
            .on("transactionHash", hash => {
              console.log("hash " + hash);
              resolve(hash);
            })
            .on("error", reject);
        })
        .catch(reject);
    });
  }
}

const pubSM = new PublicSM();

async function setTransaction(data) {
  try {
    const transactionData = pubSM._contract.methods
      .setTransaction(data.sender, data.reciever, data.value)
      .encodeABI();
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
