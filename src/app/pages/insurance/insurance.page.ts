import { Component, HostListener, NgZone } from '@angular/core';
import {ICar,IInsurance} from '../../../models/models';
const Web3 = require('web3');
const contract = require('truffle-contract');
// const carInsuranceArtifacts = require('../../../../build/contracts/CarInsurance.json');
import * as _ from 'lodash';
// import {InsuranceService} from '../../../services/insurance.service';
import {CarService} from '../../../services/car.service';


declare var window: any;


class Account {
  firstName: string;
  lastName: string;
  address: string;
}
interface IOption {
  name: string;
  id: string;
}
interface IAlert {
  type: string;
  message: string;
}

@Component({
  selector: 'insurance-page',
  templateUrl: './insurance.page.html'
})
export class InsuranceComponent {
  // CarInsurance = contract(carInsuranceArtifacts);
  registeredCarsMap: { [key: string]: ICar; } = {};
  registeredCarsArray: ICar[] = [];
  alerts: IAlert[] = [];
  insurance: IInsurance;
  insurances: IInsurance[] = [];
  insurancesMap: { [key: string]: IInsurance[]; } = {};
  vin: string;
  carValue: number;
  carValueWei: number;
  carDamage: number;
  carDamageWei: number;
  account: Account;
  address: string;
  accounts: Account[];
  addressToVin: { [key: string]: string; } = {};
  displayedOption: string;
  options: IOption[];
  categories: string[];
  web3: any;

  constructor(private _ngZone: NgZone, private carService: CarService) {
    this.displayedOption = 'setupinsurance';
    this.carValue = 10000;
    this.carValueWei = Math.round((this.carValue / 300) * (10 ** 18));
    this.options = [{
      name: 'Setup insurance',
      id: 'setupinsurance'
    },{
      name: 'Settle insurance',
      id: 'settleinsurance'
    }];
    this.checkAndInstantiateWeb3();
    this.onReady();
  }


  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  };

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
    // this.CarInsurance.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      this.alerts.push({
        type: 'success',
        message: accs
      });
      this.accounts = [{
        firstName: 'Jan',
        lastName: 'Hosek',
        address: accs[0]
      },{
        firstName: 'Jakub',
        lastName: 'Mazal',
        address: accs[1]
      },{
        firstName: 'Petr',
        lastName: 'Pribyl',
        address: accs[2]
      },{
        firstName: 'Pavel',
        lastName: 'Horsky',
        address: accs[3]
      },{
        firstName: 'Lukas',
        lastName: 'Bartosek',
        address: accs[4]
      }];
      this.account = this.accounts[2];
      this.insurance = {
        address: this.account.address,
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        vin: '19UYA31581L000000',
        dateExpiry: new Date(),
        valid: false,
        amount: 0
      };
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      const car = {
        address: "",
        firstName: "",
        lastName: "",
        vin: "19UYA31581L000000",
        spz: "1A0 5678",
        brand: "Nissan",
        model: "GT-R",
        category: "Sports car",
        distance: 0,
        dateRegistered: new Date(),
        value: 0
      };
      this.registeredCarsArray.push(car);
      if (this.registeredCarsArray.length) {
        this.vin = this.registeredCarsArray[0].vin;
      }
    });
  };
  // setupInsurance = () => {
  //   let meta;
  //   const datetimeExpiry = Math.round(((Date.now() / 1000) + (60 * 60 * 24)));
  //     this.CarInsurance
  //     .deployed()
  //     .then(instance => {
  //       meta = instance;
  //       console.log(this.carValueWei, datetimeExpiry, this.vin);
  //       //create a return statement that will call the contracts function with the right parameters
  //     }).then(value => {
  //       console.log('toSetupInsurance WORKS');
  //       let insurance = Object.assign({}, this.insurance);
  //       insurance.vin = this.vin;
  //       insurance.dateExpiry = new Date(datetimeExpiry);
  //       insurance.amount = this.carValueWei;
  //       insurance.address = this.account.address;
  //       insurance.valid = true;
  //       insurance.firstName = this.account.firstName;
  //       insurance.lastName = this.account.lastName;
  //       this.insurancesMap[this.vin] = [insurance];
  //       this.alerts.push({
  //         type: 'success',
  //         message: 'Successfully updated insurance'
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       this.alerts.push({
  //         type: 'warning',
  //         message: 'Error updating insurance; see log.'
  //       });
  //     });
  // };
  //
  // settleInsurance = () => {
  //   let meta;
  //   this.CarInsurance
  //     .deployed()
  //     .then(instance => {
  //       meta = instance;
  //       console.log(this.vin, this.carDamageWei);
  //       //create a return statement that will call the contracts function with the right parameters
  //     })
  //     .then(value => {
  //       console.log('toSettleInsurance WORKS');
  //       let insurance = Object.assign({}, this.insurancesMap[this.vin][-1]);
  //       if (this.carDamageWei >= insurance.amount) {
  //         insurance.amount = 0;
  //       };
  //       this.updateInsurance(insurance);
  //       this.alerts.push({
  //         type: 'success',
  //         message: 'Successfully settled insurance'
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       this.alerts.push({
  //         type: 'warning',
  //         message: 'Error settling insurance; see log.'
  //       });
  //     });
  // };

  onVinChange(newValue) {
    this.insurance = this.insurancesMap[newValue][-1];
    this.vin = newValue;
  }

  onAddressChange(newValue) {
    this.account = _.find(this.accounts, ['address', newValue]);
  }

  onCarValueChange(newValue) {
    this.carValueWei = Math.round((newValue / 300) * (10 ** 18));
  }

  onCarDamageChange(newValue) {
    this.carDamageWei = Math.round((newValue / 300) * (10 ** 18));
  }

  closeAlert = (alert: IAlert) => {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  // checkInsurance = () => {
  //   let meta;
  //   this.CarInsurance
  //     .deployed()
  //     .then(instance => {
  //       meta = instance;
  //       return meta.toCheckInsurance.call(this.vin);
  //     })
  //     .then(value => {
  //       console.log('toCheckInsurance WORKS');
  //       this.alerts.push({
  //         type: 'success',
  //         message: 'Insurance will last ' + value + ' seconds'
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       this.alerts.push({
  //         type: 'warning',
  //         message: 'Error checking validity of insurance; see log.'
  //       });
  //     });
  // };
  //
  // checkValidityOfInsurance = () => {
  //   let meta;
  //   this.CarInsurance
  //     .deployed()
  //     .then(instance => {
  //       meta = instance;
  //       return meta.isInsured.call(this.vin);
  //     })
  //     .then(value => {
  //       console.log('isInsured WORKS');
  //       this.alerts.push({
  //         type: 'success',
  //         message: 'Validity of insurance is ' + value
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       this.alerts.push({
  //         type: 'warning',
  //         message: 'Error checking validity of insurance; see log.'
  //       });
  //     });
  // };

}
