import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private httpClient: HttpService) { }

  async updateAlgoTransactionDraft(payload: any) {
    let self = this;
    const reqObj = {
      uri: `/algo/account/draft-update`,
      body: payload,
      params: {}
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }

  async createAlgoTransactionDraft(payload: any) {
    let self = this;
    const reqObj = {
      uri: `/algo/account`,
      body: payload,
      params: {}
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }


  async listTransactions(payload: any): Promise<any> {
    let self = this;
    const reqObj = {
      uri: `/account/transaction/list?account=${payload.account}`,
      body: payload,
      params: {}
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
}
