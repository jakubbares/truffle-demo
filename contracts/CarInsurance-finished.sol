
pragma solidity ^0.4.11;

contract CarInsurance {

    mapping (string => uint256) insuranceData;
    mapping (string => uint256) insuranceAmountData;
    mapping (string => address) insurerData;
    mapping (address => uint256) balances;
    address bank;


    function CarInsurance() {
        bank = msg.sender;
        balances[bank] = 10000000 ether;
    }

    function toPayInsurance(string _vin, uint256 _value, uint256 _datetime) payable returns(bool){
        uint256 fee = msg.value;
        require(fee > _value/100);
        balances[bank] += fee;
        insurerData[_vin] = msg.sender;
        insuranceData[_vin] = _datetime;
        insuranceAmountData[_vin] = _value;
        InsurancePayed(_vin,_datetime,_value,msg.sender);
        return true;
    }

    function toCheckInsurance(string _vin) constant returns(uint256){
      return insuranceData[_vin] - now;
    }

    function toSettleDamage(string _vin, uint256 _damage) returns(bool){
      require(isInsured(_vin));
      address insurer = insurerData[_vin];
      if (_damage > insuranceAmountData[_vin]) {
        _damage = insuranceAmountData[_vin];
        insuranceAmountData[_vin] = 0;
      }
      insurer.transfer(_damage);
      balances[bank] -= _damage;
      return true;
    }

    function isInsured(string _vin) constant returns(bool){
      return now < insuranceData[_vin];
    }

//    function toCheckInsurance(string _vin) constant returns(uint256){
//      uint256 insuranceDateTime = insuranceData[_vin];
//      return insuranceDateTime;
//    }



    event InsurancePayed(string _vin, uint256 _datetime, uint256 _value, address _lessor);

}
