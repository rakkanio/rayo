import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmmiterService {
  public isAuth: any;
  public account: any;
  constructor() {
    this.isAuth = false;
    this.account = [];

  }
  public authStateChange: Subject<string> = new Subject<string>();
  public networkStateChange: Subject<string> = new Subject<string>();
  public WalletConnectStateChange: Subject<string> = new Subject<string>();

  setAuth(flag: Boolean) {
    this.isAuth = flag === true ? false : true;
    this.authStateChange.next(this.isAuth);
  }
  setWalletConnectAccount(account: any) {
    this.account = account;
    this.WalletConnectStateChange.next(this.account);
  }
  changeNetwork() {
    this.networkStateChange.next();
  }
}
