import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import { MatDialog } from '@angular/material/dialog';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';
import { EmmiterService } from 'src/app/services/emmiter.service';
import { HandlerService } from 'src/app/services/handler.service';
import { LnpayService } from 'src/app/services/lnpay.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  public userBal: any;
  public userUSDBal: any;
  public loading = false;
  public enableOptIn = false;
  public account: any = '';
  public errorMessage = '';
  public _networkSubscription: any = null;
  constructor(private lnpayService: LnpayService,
    private router: Router, private toastr: ToastrService,
    public dialog: MatDialog,
    private event: EmmiterService,
    private handlerService: HandlerService) {
    this._networkSubscription = this.event.networkStateChange.subscribe(() => {
      this.fetchInfo();
    });
  }

  async ngOnInit(): Promise<any> {
    let self = this;
    self.fetchInfo();
  }

  async fetchInfo(): Promise<any> {
    const self = this;
    try {
      self.loading = true;
      const account: any = await self.lnpayService.getAccountInfo();
      const { data = {} } = account;
      self.loading = false;
      self.userBal = String(Number(data.xrpResponse?.result?.account_data?.Balance / 1000000).toFixed(2))
      self.userUSDBal = String(Number(data.usdAmountObj.balance).toFixed(2))
    } catch (err: any) {
      self.loading = false;
      self.userBal = '0.00';
      self.toastr.error("Error while fetching account details", "Error", { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
  async openTransferDialog() {
    this.dialog.open(TransferDialogComponent, {
      width: '400px',
      panelClass: 'transfer-dialog',
      autoFocus: true,
      hasBackdrop: true,
      backdropClass: 'bdrop',
      disableClose: true

    });
  }

  async openDecodeDialog() {
    this.dialog.open(InvoiceDialogComponent, {
      width: '400px',
      panelClass: 'transfer-dialog',
      autoFocus: true,
      hasBackdrop: true,
      backdropClass: 'bdrop',
      disableClose: true
    });
  }
}
