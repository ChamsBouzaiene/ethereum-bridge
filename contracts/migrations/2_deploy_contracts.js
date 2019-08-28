var PrivateQueue = artifacts.require("./PrivateQueue.sol");

module.exports = function(deployer) {
  deployer.deploy(PrivateQueue);
};
