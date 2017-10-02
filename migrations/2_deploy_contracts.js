var CarData = artifacts.require("./CarData.sol");

module.exports = function(deployer) {
  deployer.deploy(CarData);
};
