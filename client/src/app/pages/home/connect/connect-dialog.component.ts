import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HandlerService } from 'src/app/services/handler.service';
import { EmmiterService } from 'src/app/services/emmiter.service';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent implements OnInit {
  public loading = false;

  constructor(private toastr: ToastrService,
    private router: Router, private dialog: MatDialog,
    private handlerService: HandlerService, private event: EmmiterService) { }

  ngOnInit(): void {
  }

  async connectToAlgoSigner() {
    const self = this;
    try {
      self.loading = true;
      await self.handlerService.walletConnectHandler(environment.WALLET_TYPE.ALGO_SIGNER);
      self.dialog.closeAll();
      self.event.changeNetwork();
      self.router.navigate(['/account/wallet']);
      self.loading = false;
    } catch (err: any) {
      self.loading = false;
      self.toastr.error(err, 'Error', { timeOut: environment.ALERT_DESTROY_MAX_TIME });

    }
  }

  async connectToMyAlgo() {
    const self = this;
    try {
      self.loading = true;
      await self.handlerService.walletConnectHandler(environment.WALLET_TYPE.MY_ALGO_WALLET);
      self.event.changeNetwork();
      self.router.navigate(['/account/wallet']);
      self.dialog.closeAll();
      self.loading = false;
    } catch (err: any) {
      self.loading = false;
      self.toastr.error(err, 'Error', { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
  async connectToWalletConnect() {
    const self = this;
    try {
      self.loading = true;
      await self.handlerService.walletConnectHandler(environment.WALLET_TYPE.WALLET_CONNECT);
      self.event.changeNetwork();
      self.dialog.closeAll();
      self.loading = false;
    } catch (err: any) {
      self.loading = false;
      self.toastr.error(err, 'Error', { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
  async connectToGemWallet() {
    const self = this;
    try {
      self.loading = true;
      await self.handlerService.walletConnectHandler(environment.WALLET_TYPE.GEM_WALLET);
      self.event.changeNetwork();
      self.router.navigate(['/account/wallet']);
      self.dialog.closeAll();
      self.loading = false;
    } catch (err: any) {
      self.loading = false;
      self.toastr.error(err, 'Error', { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
}
