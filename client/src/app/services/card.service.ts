import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private httpClient: HttpService) {}
  getPublicKey(): any {
    let self = this;
    const reqObj = {
      uri: '/circle/encryption/key',
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj).subscribe(
        (data: any) => resolve(data),
        (error: any) => reject(error)
      );
    });
  }
  addCard(body: any): any {
    let self = this;
    const reqObj = {
      uri: '/circle/card',
      body: body,
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj).subscribe(
        (data: any) => resolve(data),
        (error: any) => reject(error)
      );
    });
  }
  makeCardPayment(body: any): any {
    let self = this;
    const reqObj = {
      uri: '/circle/card/payment',
      body: body,
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj).subscribe(
        (data: any) => resolve(data),
        (error: any) => reject(error)
      );
    });
  }
  getConversionRate() {
    let self = this;
    const reqObj = {
      uri: '/exchange/rate',
      params: { USDMXN: environment.UPHOLD.EXCHANGE_USDMXN },
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj).subscribe(
        (data: any) => resolve(data),
        (error: any) => reject(error)
      );
    });
  }
}
