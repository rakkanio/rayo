import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './pages/nav/nav.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HandlerService } from './services/handler.service';
import { MyAlgoService } from './services/my-algo.service';
import { CacheService } from './services/cache.service';
import { AlgoApiService } from './services/algo-api.service';
import { TransactionService } from './services/transaction.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardService } from './services/card.service';
import { SmxService } from './services/smx.service';
import { GemWalletConnectService } from './services/gem-wallet-connect.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    BrowserModule
  ],
  providers: [
    MyAlgoService,
    HttpService,
    HandlerService,
    CacheService,
    AlgoApiService,
    TransactionService,
    CardService,
    SmxService,
    GemWalletConnectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
