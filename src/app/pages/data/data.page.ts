import { Component, HostListener, NgZone } from '@angular/core';
import {ICar} from '../../../models/models';
import {CarService} from '../../../services/car.service';
const Web3 = require('web3');
const contract = require('truffle-contract');
const carDataArtifacts = require('../../../../build/contracts/CarData.json');
import * as _ from 'lodash';
const BigNumber = require('bignumber.js');

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
  selector: 'data-page',
  templateUrl: './data.page.html'
})
export class DataComponent {
  CarData = contract(carDataArtifacts);
  registeredCarsMap: { [key: string]: ICar; } = {};
  registeredCarsArray: ICar[] = [];
  alerts: IAlert[] = [];
  car: ICar;
  vin: string;
  distance: number;
  account: Account;
  address: string;
  accounts: Account[];
  categories: string[];
  addressToVin: { [key: string]: string; } = {};
  displayedOption: string;
  showOption: string;
  options: IOption[];
  web3: any;

  constructor(private _ngZone: NgZone, private carService: CarService) {
    this.displayedOption = "register";
    this.categories = ["Microcar", "Compact car", "Mid-size car", "Grand tourer", "Luxury car", "SUV", "Convertible", "Sports car", "Minivan", "Cargo van", "Pickup truck" ];
    this.car = {
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
    this.options = [{
      name: "Register car",
      id: "register"
    },{
      name: "Update distance for car",
      id: "updatekm"
    },{
      name: "Show registered cars",
      id: "showreg"
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
    this.CarData.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      this.alerts.push({
        type: 'success',
        message: accs
      });
      this.accounts = [{
        firstName: "Jan",
        lastName: "Hosek",
        address: accs[0]
      },{
        firstName: "Jakub",
        lastName: "Mazal",
        address: accs[1]
      },{
        firstName: "Petr",
        lastName: "Pribyl",
        address: accs[2]
      },{
        firstName: "Pavel",
        lastName: "Horsky",
        address: accs[3]
      },{
        firstName: "Lukas",
        lastName: "Bartosek",
        address: accs[4]
      }];
      this.account = this.accounts[2];
      this.car = {
        address: this.account.address,
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        vin: "19UYA31581L000000",
        spz: "1A0 5678",
        brand: "Nissan",
        model: "GT-R",
        category: "Sports car",
        distance: 0,
        dateRegistered: new Date(),
        value: 0
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
      this.carService.getCars().subscribe(data => {
        this.registeredCarsArray = data.data;
        this.registeredCarsMap = {};
        this.registeredCarsArray.forEach((car) => {
          this.registeredCarsMap[car.vin] = car;
          this.addressToVin[car.address] = car.vin;
        });
      });
      if (this.registeredCarsArray.length){
        this.vin = this.registeredCarsArray[0].vin;
      }
    });
  };

  registerCar(car: ICar) {
    this.carService.postCar(car).subscribe(data => {
      this.car = data.data;
    });
  }

  updateCar(car: ICar) {
    this.carService.updateCar(car).subscribe(data => {
      this.car = data.data;
    });
  }


  registerAsCarOwner = () => {
    let meta;
    this.CarData
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.toRegisterAsCarOwner(this.car.vin, this.car.spz, { from: this.account.address, gas: 500000 });
      })
      .then(value => {
        console.log("toRegisterAsCarOwner WORKS");
        this.car = { address: this.account.address, firstName: this.account.firstName, lastName: this.account.lastName, vin: this.car.vin, spz: this.car.spz,
          brand: this.car.brand, model: this.car.model, category: this.car.category, distance: 0, dateRegistered: new Date(), value: 0 };
        const car = Object.assign({}, this.car);
        const account =  Object.assign({}, this.account);
        if (!this.registeredCarsMap[car.vin]) {
          this.registerCar(car);
          this.registeredCarsArray.push(car);
        }
        this.registeredCarsMap[car.vin] = car;
        this.addressToVin[account.address] = car.vin;
        this.alerts.push({
          type: 'success',
          message: 'Successfully registered car',
        });
      })
      .catch(e => {
        console.log(e);
        this.alerts.push({
          type: 'warning',
          message: 'Error registering car; see log.'
        });
      });
  };

  updateDistance = () => {
    let meta;
    this.CarData
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.toUpdateDistance(this.vin, this.car.distance, { from: this.account.address, gas: 500000  }); //this.addressToVin[this.account.address]
      })
      .then(value => {
        console.log("toUpdateDistance WORKS");
        let car = Object.assign({}, this.car);
        car.distance = this.car.distance;
        this.updateCar(car);
        this.registeredCarsMap[car.vin].distance = this.car.distance;
        this.alerts.push({
          type: 'success',
          message: 'Successfully updated distance'
        });
      })
      .catch(e => {
        console.log(e);
        this.alerts.push({
          type: 'warning',
          message: 'Error updating distance; see log.'
        });
      });
  };

  showDistanceForVin = (_vin: string) => {
    let meta;
    this.CarData
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.toGetDistance.call(_vin, { from: this.accounts[3].address, value: 5000000 ,gas: 500000  });
      })
      .then(value => {
        console.log("toGetDistance WORKS");
        this.distance = value;
        this.alerts.push({
          type: 'success',
          message: 'Successfully updated distance for vin'
        });
      })
      .catch(e => {
        console.log(e);
        this.alerts.push({
          type: 'warning',
          message: 'Error getting distance travelled for car; see log.'
        });
      });
  };

  showDataForVin = (_vin: string) => {
    this.car = _.find(this.registeredCarsArray, ['vin', _vin]);
    this.showDistanceForVin(_vin);
  }

  onVinChange(newValue) {
    this.car = this.registeredCarsMap[newValue];
    this.vin = newValue;
  }

  onAddressChange(newValue) {
    this.account = _.find(this.accounts, ['address', newValue]);
  }

  closeAlert = (alert: IAlert) => {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
