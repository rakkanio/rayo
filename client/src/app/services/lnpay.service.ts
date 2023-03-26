import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LnpayService {

  constructor(private httpClient: HttpService, private cacheService: CacheService) { }
  async getAccountInfo() {
    let self = this;
    const account = self.cacheService.get('walletAddress')
    const reqObj = {
      uri: `/lnpay/account/info`,
      params: { account: account }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe(
          (data: any) => resolve(data),
          (error: any) => reject(error)
        )
    })
  }
  decodeInvoice(reqObject: any) {
    let self = this;
    const reqObj = {
      uri: '/lnpay/decode',
      body: reqObject
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe(
          (data: any) => resolve(data),
          (error: any) => reject(error)
        )
    })
  }

  async updateLnPayTransactionDraft(payload: any) {
    let self = this;
    const reqObj = {
      uri: `/lnpay/account/draft-update`,
      body: payload
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
  async listTransactions(payload: any) {
    let self = this;
    const reqObj = {
      uri: `/account/transaction/list`,
      body: payload
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
}
