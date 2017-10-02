var ConnectedCar = artifacts.require("./CarLease.sol");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var BigNumber = require('bignumber.js');

contract('ConnectedCar', function(accounts) {
    it("should deploy contract", function() {
        return ConnectedCar.deployed().then(function(instance) {
            console.log(instance.skodaAuto);
            assert.equal(instance.skodaAuto,ConnectedCar.deployed_address,"Equal");
        });
    });
    it("should register car", function() {
        return ConnectedCar.deployed().then(function(instance) {
            return instance.toRegisterAsCarOwner.call("19UYA31581L000000","spz","brand","model","category",{from: "0x26171efb2f6b763fe61b9f1f4e1788996a30ec6a"});
        }).then(function(status) {
            assert.equal(status.valueOf(), true, "Car wasn't registered");
        });
    });
    it("should update distance", function() {
      return ConnectedCar.deployed().then(function (instance) {
        return instance.toUpdateDistance.call("19UYA31581L000000", 10000,{from: "0x26171efb2f6b763fe61b9f1f4e1788996a30ec6a"})
          .then(function (status) {
            assert.equal(status.valueOf(), true, "Distance wasn't updated");
          });
      });
    });
    it("should return distance for vin", function() {
      return ConnectedCar.deployed().then(function (instance) {
        const ticketPrice = web3.toWei(.000000000005, 'ether');
        return instance.toGetDistance.call("19UYA31581L000000",{from: "0x9d8a7c32c53bfbce0bf97a1cedba60be7e893cc7", value: ticketPrice})
          .then(function (distance) {
            assert.equal(distance.valueOf(), 10000, "Distance doesn't match");
          });
      });
    });
    it("should return balance for vin", function() {
      return ConnectedCar.deployed().then(function (instance) {
        return instance.toShowBalance.call("19UYA31581L000000")
          .then(function (balance) {
            assert.equal(balance.valueOf(), 5000000, "Balance doesn't match");
          });
      });
    });
});
