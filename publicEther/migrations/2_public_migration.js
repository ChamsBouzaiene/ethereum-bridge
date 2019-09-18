var PublicQueue = artifacts.require("./PublicQueue.sol");

module.exports = function(deployer) {
  deployer.deploy(PublicQueue);
};
