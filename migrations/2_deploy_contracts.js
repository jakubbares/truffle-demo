var CarData = artifacts.require("./CarData.sol");
//require the Insurance contract

module.exports = function(deployer) {
  deployer.deploy(CarData);
  // deploy the insurance contract
};
