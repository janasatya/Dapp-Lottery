const SimpleStorage = artifacts.require("Lottery");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
