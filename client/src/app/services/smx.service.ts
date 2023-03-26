import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class SmxService {
  public alertDestroyMaxTime: number = 8000;
  public alertDestroyMinTime: number = 8000;
  private depositData: any = {};
  constructor(private httpClient: HttpService) { }

  makeBillPayment(body: any) {
    let self = this;
    const reqObj = {
      uri: '/utility/bill/payment',
      body: body
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe(
          (data: any) => resolve(data),
          (error: any) => reject(error)
        )
    })
  }
}

