const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    private: {
      port: 8545,
      network_id: 5777,
      gas: 6000000,
      host: "127.0.0.1"
    }
  }
};
