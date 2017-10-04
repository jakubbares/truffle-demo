
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
        //check that fee is value of car / 100
        //transfer fee to bank
        //register payment sender
        //register date when insurance finishes
        //register value of car
        //send an event confiming payment
        return true;
    }

    function toCheckInsurance(string _vin) constant returns(uint256){
      //return how much time is left on car insurance
    }

    function toSettleDamage(string _vin, uint256 _damage) returns(bool){
      //check car is insured at the moment
      //find out who is insurer of the car
      //if damage is higher that value of car insured then decrease the damage to the car value
      //transfer the damage value to the insurer
      //decrease balance of the bank by the damage value
      return true;
    }

    function isInsured(string _vin) constant returns(bool){
      //check car is insured at the moment
    }

    event InsurancePayed(string _vin, uint256 _datetime, uint256 _value, address _lessor);

}
