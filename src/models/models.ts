export interface ICar {
  address: string;
  firstName: string;
  lastName: string;
  vin: string;
  spz: string;
  brand: string;
  model: string;
  category: string;
  distance: number;
  dateRegistered: Date;
  value: number;
}

export interface IService {
  vin: string;
  dealerName: string;
  dealerId: number;
  action: string;
  amount: number;
  dateRegistered: Date;
}

export interface IInsurance {
  address: string;
  firstName: string;
  lastName: string;
  vin: string;
  dateExpiry: Date;
  valid: boolean;
  amount: number;
}

export interface ILoan {
  address: string;
  firstName: string;
  lastName: string;
  vin: string;
  amount: number;
}

