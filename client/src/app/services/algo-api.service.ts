import { Injectable } from '@angular/core';
import algosdk from "algosdk";
import { environment } from 'src/environments/environment';
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { TransactionService } from './transaction.service';
import { CacheService } from './cache.service';
import { HttpService } from './http.service';
declare var window: any;
@Injectable({
  providedIn: 'root'
})
export class AlgoApiService {
  public algoClient: any;
  public assetId: any;
  constructor(private transactionService: TransactionService,
    private cacheService: CacheService, private httpClient: HttpService) {
    // this.init();
  }

  init(networkURL: any) {
    const network = this.cacheService.get('network');
    if (network === environment.NETWORK_TYPE.MAINNET) {
      this.assetId = environment.ASSET_ID.MainNet;
    } else {
      this.assetId = environment.ASSET_ID.TestNet;
    }
    this.algoClient = new algosdk.Algodv2("", networkURL, "");
  }

  async apiGetTxnParams(): Promise<any> {
    const self = this;
    const params = await self.algoClient.getTransactionParams().do();
    return params;
  }

  async makeTransactionWitParams(attr: any): Promise<any> {
    const self = this;
    const suggestedParams = await self.apiGetTxnParams();
    const paramsObj: any = {
      from: attr.from,
      to: attr.toAccount,
      amount: Number(attr.amount) * 1000000,
      assetIndex: self.assetId,
      note: new Uint8Array(Buffer.from(attr.note)),
      suggestedParams,
    }
    const txn = await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(paramsObj);
    paramsObj.txn = txn.toByte();
    paramsObj.status = "initiated";
    const txnResp: any = await self.transactionService.createAlgoTransactionDraft(paramsObj);
    const { data } = txnResp;
    const txnsToSign = [{ txn, message: "This is a transaction message" }];
    return { txnsToSignArr: [txnsToSign], txnResp: data };
  }

  async prepareTxn(txnToSign: any): Promise<any> {
    const flatTxns = txnToSign.reduce((acc: any, val: any) => acc.concat(val), []);
    const walletTxns: any = flatTxns.map(
      (txn: any) => ({ txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn.txn)).toString("base64") }),
    );

    // sign transaction
    const requestParams: any = [walletTxns];
    const requestPayload = formatJsonRpcRequest("algo_signTxn", requestParams);
    return { txnToSign: txnToSign, requestPayload: requestPayload };
  }

  async submitTransaction(stxns: any): Promise<any> {
    const self = this;
    const { txId } = await self.algoClient.sendRawTransaction(stxns).do();
    return txId;
  }

  async optIn(attr: any): Promise<any> {
    const self = this;
    const network = self.cacheService.get('network');
    const suggestedParams = await self.apiGetTxnParams();
    const paramsObj: any = {
      from: attr.account,
      to: attr.account,
      amount: 0,
      assetIndex: self.assetId,
      note: new Uint8Array(Buffer.from("USDC OPT IN")),
      suggestedParams,
    }
    const txn = await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(paramsObj);

    // Use the AlgoSigner encoding library to make the transactions base64
    const txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    const signedTxs = await window.AlgoSigner.signTxn([{ txn: txn_b64 }])
    const sendRes = await window.AlgoSigner.send({ ledger: network, tx: signedTxs[0].blob });
    return sendRes;
  }

  async optInApp(): Promise<any> {
    const self = this;
    const network = self.cacheService.get('network');
    const suggestedParams = await self.apiGetTxnParams();
    let sender = self.cacheService.get('walletAddress');
    // const txn = await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(paramsObj);
    let txn = algosdk.makeApplicationOptInTxn(sender, suggestedParams, environment.ALGO_APP_ID)

    // Use the AlgoSigner encoding library to make the transactions base64
    const txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    const signedTxs = await window.AlgoSigner.signTxn([{ txn: txn_b64 }])
    const sendRes = await window.AlgoSigner.send({ ledger: network, tx: signedTxs[0].blob });
    return sendRes;
  }

  async validate(payload: any): Promise<any> {
    let self = this;
    const reqObj = {
      uri: `/algo/account/validate`,
      params: { account: payload.account }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.get(reqObj)
        .subscribe(
          async (res: any) => {
            resolve(res.data);
          },
          (error: any) => {
            reject(error)
          }
        )
    })
  }

  async prepareGroupTransactions(attrs: any): Promise<any> {
    let { account, sellAmount: amount } = attrs;
    amount = amount * 1000000
    const self = this;
    let assetID = this.assetId; // change to your own assetID
    let params = await self.algoClient.getTransactionParams().do();
    let sender = account;
    let recipient = sender;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let note = undefined;
    let app_id = environment.ALGO_APP_ID;
    let contract_address = environment.ALGO_CONTRACT_ADDRESS;
    // Build required app args as Uint8Array
    let callArg = new TextEncoder().encode("deposit")
    let appArgs = [callArg]
    // Create ApplicationCallTxn
    let appCallTxn = await algosdk.makeApplicationCallTxnFromObject({
      from: account,
      appIndex: app_id,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      suggestedParams: params,
      appArgs: appArgs
    })

    let transferTxn = await algosdk.makeAssetTransferTxnWithSuggestedParams(sender, contract_address, closeRemainderTo, revocationTarget,
      amount, note, assetID, params);


    let txns = [appCallTxn, transferTxn]
    let txgroup = algosdk.assignGroupID(txns);
    return txgroup
  }
  async updateAccountInfo(attr: any): Promise<any> {
    const self = this;
    const reqPayload = {
      uri: `/algo/account/update`,
      body: attr.body,
      params: { account: attr.account }
    };
    return new Promise((resolve, reject) => {
      self.httpClient.post(reqPayload)
        .subscribe((res: any) => resolve(res),
          (error: any) => reject(error)
        )
    })
  }
}
