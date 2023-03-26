import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from 'src/app/services/cache.service';
import { HandlerService } from 'src/app/services/handler.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'transfer-dialog',
  templateUrl: 'transfer-dialog.component.html',
  styleUrls: ['transfer-dialog.component.scss'],
})
export class TransferDialogComponent {
  public loading = false;
  public isMainPage = true;
  public txnId = '';
  public transactionId = '';
  public model: any = {};
  constructor(private toastr: ToastrService,
    private cacheService: CacheService,
    private handlerService: HandlerService,
    private transactionService: TransactionService) { }

  async onSubmit(form: NgForm) {
    const self = this;

    try {
      self.loading = true;
      const value = form.value;
      value.from = self.cacheService.get('walletAddress');
      value.walletType = self.cacheService.get('walletType');
      const resObj = await self.handlerService.walletTransfertHandler(value);
      self.transactionId = resObj.transactionId;
      self.txnId = resObj.transactionId;
      self.loading = false;
      self.isMainPage = false;
      form.reset();
      self.toastr.success("Assets transfered successfully", "Success", { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    } catch (err: any) {
      self.loading = false;
      self.toastr.error(err.message || err || "Error while making transfer", "Error", { timeOut: environment.ALERT_DESTROY_MAX_TIME });
    }
  }
}
