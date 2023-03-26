import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';
import { EmmiterService } from 'src/app/services/emmiter.service';
import { AlgoApiService } from 'src/app/services/algo-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnectDialogComponent } from '../home/connect/connect-dialog.component';
import { environment } from 'src/environments/environment';
/**
 * Navbar component to provide functionality on navbar
 *
 * @export
 * @class NavComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isAuth: boolean = false;
  public isAdmin: boolean = false;
  public userInfo: any = null;
  public showTab: boolean = false;
  public loading: boolean = false;
  public _authSubscription: any = null;
  public mainnetNetwork;
  public disableNetwork: boolean = false;
  public leftLinks: any = [
    { tab: 'Wallet', link: '/account/wallet' },
    // { tab: 'History', link: '/account/history' },
    // { tab: 'Offers', link: '/account/offers' },
    // { tab: 'BillPay', link: '/account/bill-pay' }
    // { tab: 'History', link: '#' },
    // { tab: 'Deposit', link: '#' },
    // { tab: 'Bill Pay', link: '#' }
  ];
  routes: any = [
    { pos: 0, r: 'wallet' },
    // { pos: 1, r: 'history' },
    // { pos: 2, r: 'offers' },
    // { pos: 3, r: 'billpay' }
    // { pos: 3, r: 'pay' }
  ]
  h: any = [0, 1, 2];
  activeLink: any;
  constructor(private location: Location, private router: Router,
    private cacheService: CacheService, private event: EmmiterService,
    private algoApi: AlgoApiService, public dialog: MatDialog) {
    let networkType = this.cacheService.get('network');
    let network = networkType || environment.NETWORK_TYPE.TESTNET;
    this.cacheService.setNetwork(network);
    this.cacheService.set('network', network)
    if (networkType === environment.NETWORK_TYPE.MAINNET) {
      this.mainnetNetwork = true;
      this.algoApi.init(environment.ALGO_V2_MAINNET_URL);
    } else {
      this.mainnetNetwork = false;
      this.algoApi.init(environment.ALGO_V2_TESTNET_URL);
    }

    this.location.onUrlChange(url => {
      let r = url.split('/');
      let item = r[r.length - 1];
      const found = this.routes.find((element: any) => element.r === item);
      if (found) {
        this.activeLink = this.leftLinks[found.pos];
      } else {
        this.activeLink = this.leftLinks[-1];
      }
    });
    this._authSubscription = this.event.authStateChange.subscribe((value) => {
      this.isAuth = !(Boolean(value));
    });
  }

  ngOnInit() {
    const self = this;
    const active = self.cacheService.get('active');
    if (active !== 'true') {
      self.router.navigate(['/home']);
    } else {
      self.isAuth = true;
    }

  }
  disconnect() {
    this.cacheService.remove('walletObj');
    this.cacheService.remove('walletAddress');
    this.cacheService.remove('walletType');
    this.cacheService.remove('active');
    this.isAuth = false;
    this.router.navigate(['/home']);
  }

  toggle(event: any) {
    const self = this;
    let network;
    this.disableNetwork = true;
    if (event.checked) {
      network = environment.NETWORK_TYPE.MAINNET;
      self.cacheService.set('network', environment.NETWORK_TYPE.MAINNET);
    } else {
      network = environment.NETWORK_TYPE.TESTNET;
      self.cacheService.set('network', environment.NETWORK_TYPE.TESTNET);
    }
    this.cacheService.setNetwork(network);
    this.dialog.open(ConnectDialogComponent, {
      width: '400px',
      panelClass: 'connect-dialog',
      hasBackdrop: false
    });
    this.dialog._getAfterAllClosed().subscribe(result => {
      this.disableNetwork = false;
    })
  }
}

