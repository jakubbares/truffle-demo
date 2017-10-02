import {Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ICar } from '../models/models';


@Injectable()
export class CarService implements OnInit {
  private baseUrl = 'http://localhost:3000/cars';
  constructor(private http: Http) {
  }
  ngOnInit() {
  }

  getCars(): Observable<any> {
    return this.http.get(this.baseUrl)
      .map(this.extractData)
      .do(data => console.log('getCars: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  postCar(car: ICar): Observable<any> {
    const body = JSON.stringify(car);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseUrl + '/create', body, options)
      .map((res: Response) => res.json())
      .do(data => console.log('postCar: ' + JSON.stringify(data)))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateCar(car: ICar): Observable<any> {
    const body = JSON.stringify(car);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(this.baseUrl + '/' + car.vin + '/update', body, options)
      .map((res: Response) => res.json())
      .do(data => console.log('updateCar: ' + JSON.stringify(data)))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  private extractData(response: Response) {
    const body = response.json();
    return body || {};
  }

  private handleError(error: Response): Observable<any> {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
