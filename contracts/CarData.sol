
pragma solidity ^0.4.11;

contract CarData {

  mapping (string => uint256) distanceData;
  mapping (string => string) vinToSpz;
  mapping (string => address) vinToAddress;
  mapping (address => string) addressToVin;
  mapping (address => uint256) balances;
  address skoda;


  function CarData() {
    skoda = msg.sender;
  }

  function toRegisterAsCarOwner(string _vin, string _spz) returns(bool){
    vinToAddress[_vin] = msg.sender;
    distanceData[_vin] = 0;
    vinToSpz[_vin] = _spz;
    CarRegistered(_vin,_spz,msg.sender);
    return true;
  }

  function toUpdateDistance(string vin, uint256 _distance) returns(bool){
    //string storage vin = addressToVin[msg.sender];
    distanceData[vin] = _distance;
    DistanceUpdated(vin,_distance);
    return true;
  }

  function toGetDistance(string _vin) payable returns(uint256){
    require(msg.value >= 200 wei);
    address owner = vinToAddress[_vin];
    balances[owner] += msg.value;
    uint256 distance = distanceData[_vin];
    return distance;
  }

  function toShowBalance(string _vin) returns(uint256){
    address owner = vinToAddress[_vin];
    uint256 balance = balances[owner];
    return balance;
  }

  function toPayOutBalance() {
    //   require(carData[addressToVin[msg.sender]].isValue);
    msg.sender.transfer(balances[msg.sender]);
    balances[msg.sender] = 0;
    BalancePayedOut(addressToVin[msg.sender],balances[msg.sender]);
  }

  event CarRegistered(string _vin, string _spz, address _owner);
  event DistanceUpdated(string _vin, uint256 _distance);
  event BalancePayedOut(string _vin, uint256 _amount);


}
