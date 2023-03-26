import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from 'src/app/services/cache.service';
import { HandlerService } from 'src/app/services/handler.service';
import { LnpayService } from 'src/app/services/lnpay.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.scss']
})
export class InvoiceDialogComponent implements OnInit {
  public loading: boolean = false;
  public isMainPage: boolean = true;
  public showResponse: boolean = false;
  public invoiceResult: any;
  public txnId: any;
  public model: any = {};
  public paymentRequest: any = '';
  public walletAddress: any = '';

  constructor(private lnPay: LnpayService,
    private toastr: ToastrService,
    private lnPayService: LnpayService,
    private cacheService: CacheService,
    private handlerService: HandlerService) {
    this.walletAddress = environment.GEM_HOT_WALLET
  }

  ngOnInit(): void {
  }
  async decodeInvoice(form: NgForm) {
    let self = this;
    try {
      self.loading = true;
      let reqObject: any = {};
      reqObject.paymentRequest = form.value.paymentRequest;
      self.paymentRequest = reqObject.paymentRequest;
      const result = await self.lnPay.decodeInvoice(reqObject)
      self.isMainPage = false;
      self.loading = false;
      self.invoiceResult = result;
    } catch (err: any) {
      self.loading = false;
      self.toastr.error(err || "Error while decoding invoice", "Error", { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
  async payInvoice() {
    let self = this;
    try {
      self.loading = true;
      const reqObj = {
        from: self.cacheService.get('walletAddress'),
        amount: self.invoiceResult.data.usdcAmount,
        toAccount: self.invoiceResult.data.destination,
        transactionId: self.invoiceResult.data.transactionId,
        walletType: self.cacheService.get('walletType'),
        note: "USDC invoice payment"
      };
      const resObj = await self.handlerService.walletTransfertHandler(reqObj);
      self.txnId = resObj.transactionId;
      const draft = {
        transactionId: resObj.transactionId,
        paymentRequest: self.paymentRequest
      }
      await self.lnPayService.updateLnPayTransactionDraft(draft);

      self.loading = false;
      self.isMainPage = false;
      self.showResponse = true;
      self.toastr.success("Invoice paid successfully", "Success", { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    } catch (err: any) {
      self.loading = false;

      self.toastr.error(err || "Error while paying invoice", "Error", { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
}
