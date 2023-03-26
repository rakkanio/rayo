import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { WalletComponent } from './pages/wallet/wallet.component';
import { HomeComponent } from './pages/home/home.component';
import { TransferDialogComponent } from './pages/wallet/transfer-dialog/transfer-dialog.component';
import { InvoiceDialogComponent } from './pages/wallet/invoice-dialog/invoice-dialog.component';
import { ConnectDialogComponent } from './pages/home/connect/connect-dialog.component';



@NgModule({
  declarations: [
    HomeComponent,
    WalletComponent,
    HomeComponent,
    TransferDialogComponent,
    InvoiceDialogComponent,
    ConnectDialogComponent,
  ],
  imports: [
    NgMaterialModule,
    NgxLoadingModule.forRoot({}),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'account/wallet', component: WalletComponent },
      { path: '**', redirectTo: 'home' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule { }
