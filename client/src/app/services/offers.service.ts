import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(private httpClient: HttpService) { }

  async createOffer(payload: any): Promise<any> {
    let self = this;
    const reqObj = {
      uri: `/account/offer`,
      body: payload,
      params: { account: payload.account }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }


  async takeOffer(offer: any): Promise<any> {
    const self = this;
    const reqPayload = {
      uri: `/account/offer/take`,
      body: offer,
      params: { account: offer.taker }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqPayload)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }

  async listOffer(): Promise<any> {
    let self = this;
    const reqObj = {
      uri: `/account/offer/list`,
      params: {}
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
  listActiveOffer(account: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/account/offer/active/list`,
      params: { account: account }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }

  listTakenOffer(offer: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/account/offer/taken/list`,
      params: { account: offer }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
  getOffer(offerId: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/offer`,
      params: { id: offerId }
    };

    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
  updateStatus(offerId: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/account/offer/status`,
      params: { id: offerId }
    };

    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
  updateOffer(attr: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/account/offer/update`,
      body: attr.body,
      params: { account: attr.account }
    };

    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }

  cancelOffer(offer: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/account/offer/cancel`,
      body: offer,
      params: { account: offer.account }
    };

    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }

  confirmOffer(offer: any): Promise<any> {
    const self = this;
    const reqObj = {
      uri: `/account/offer/confirm`,
      body: offer,
      params: { account: offer.account }
    };

    return new Promise((resolve, reject) => {
      self.httpClient.post(reqObj)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }

}
