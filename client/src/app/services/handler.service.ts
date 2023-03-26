import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CacheService } from './cache.service';
import { EmmiterService } from './emmiter.service';
import { GemWalletConnectService } from './gem-wallet-connect.service';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {
  public _walletConnectSubscription: any = null;
  constructor(
    private cacheService: CacheService,
    private event: EmmiterService,
    private router: Router,
    private gemWalletService: GemWalletConnectService) { }

  async walletConnectHandler(walletType: string) {
    const self = this;

    switch (walletType) {
      case environment.WALLET_TYPE.GEM_WALLET: return await self.gemWalletConnect();
      default:
        console.log('unhandled Wallet connect');
        return false;
    }
  }

  async gemWalletConnect() {
    try {
      const self = this;
      await self.gemWalletService.connect();
      const account = await self.gemWalletService.getAddress()
      const stateObj = {
        account: account,
        walletType: environment.WALLET_TYPE.GEM_WALLET
      }
      self.cacheService.set('walletObj', JSON.stringify(stateObj));
      self.cacheService.set('walletAddress', stateObj.account);
      self.cacheService.set('walletType', stateObj.walletType);
      self.cacheService.set('active', 'true');
      self.event.setAuth(true);
      self.router.navigate(['/account/wallet']);
      return stateObj;
    } catch (error: any) {
      console.log('Error in walletconnect connectivity')
      throw new Error(error.message || 'Error while connecting walletconnect');
    }
  }


  async walletTransfertHandler(reqObj: any): Promise<any> {
    const self = this;
    const walletType = self.cacheService.get('walletType');
    switch (walletType) {
      case environment.WALLET_TYPE.GEM_WALLET: return await self.gemWalletConnectTransfer(reqObj);
      default:
        console.log('unhandled Wallet transfer');
        return false;
    }
  }
  async gemWalletConnectTransfer(reqObj: any) {
    try {
      const self = this;
      const paramsRes = await self.gemWalletService.sendTransaction(reqObj);
      const stateObj = {
        transactionId: paramsRes
      }
      return stateObj;
    } catch (error: any) {
      console.log('Error in wallectconnect transfer', error);
      throw new Error(error || 'Error while transfering with WalletConnect');
    }
  }
}
