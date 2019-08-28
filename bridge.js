const Web3 = require("web3");

//Get Smart Contract Data
const PrivateQueue = require("./PrivateQueue");
const { abi } = PrivateQueue;
const address = PrivateQueue.networks["5777"].address;

// Instanciate Web3
let web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);

// Testing web3 instance
async function getAccouts() {
  const accounts = await web3.eth.getAccounts();
  return console.log(accounts);
}

//Instansiate A Smart Contract
const smartContract = new web3.eth.Contract(abi, address);

//Listen On events
smartContract.events
  .Transfer({ filter: {}, fromBlock: 0 }, function(error, event) {
    console.log(event);
  })
  .on("data", function(event) {
    console.log(event); // same results as the optional callback above
  })
  .on("changed", function(event) {
    // remove event from local database
  })
  .on("error", console.error);

smartContract
  .getPastEvents(
    "Transfer",
    {
      fromBlock: 0,
      toBlock: "latest"
    },
    function(error, events) {
      console.log("events");
    }
  )
  .then(function(events) {
    console.log("events"); // same results as the optional callback above
  });

smartContract.once(
  "Transfer",
  {
    filter: { myIndexedParam: [20, 23], myOtherIndexedParam: "0x123456789..." }, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0
  },
  function(error, event) {
    console.log(event);
  }
);

smartContract.events
  .allEvents({ filter: {}, fromBlock: 0 }, function(error, event) {
    console.log(event);
  })
  .on("data", function(event) {
    console.log(event); // same results as the optional callback above
  })
  .on("changed", function(event) {
    // remove event from local database
  })
  .on("error", console.error);

// const EventEmitter = require("events");
// class MyEmitter extends EventEmitter {}
// const myEmitter = new MyEmitter();
// myEmitter.on("event", function(a, b) {
//   console.log(a, b, this);
//   // Prints:
//   //   Technoetics Club MyEmitter {
//   //     domain: null,
//   //     _events: { event: [Function] },
//   //     _eventsCount: 1,
//   //     _maxListeners: undefined }
// });
// // myEmitter.emit("event", "Technoetics", "Club");

// setInterval(function() {
//   console.log("timer that keeps nodejs processing running");
// }, 1000 * 60 * 60);
