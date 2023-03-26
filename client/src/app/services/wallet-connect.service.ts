import { Injectable } from '@angular/core';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import algosdk from 'algosdk';
import { environment } from 'src/environments/environment';
import { AlgoApiService } from './algo-api.service';
import { CacheService } from './cache.service';
import { EmmiterService } from './emmiter.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {
  public connector: any;
  constructor(private event: EmmiterService,
    private algoApiService: AlgoApiService,
    private httpClient: HttpService, private cacheService : CacheService) {
  }

  async initConnection() {
    if (!this.connector) {
      await this.connect();
    }
  }
  async setConnector(connector: any) {
    this.connector = connector;
  }
  getConnector() {
    return this.connector;
  }
  async connect(): Promise<any> {
    const self = this;
    // Create a connector
    const connector = new WalletConnect({
      bridge: environment.WALLET_CONNECT_BRIDGE_URL, // Required
      qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }
    self.setConnector(connector);

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      self.event.setWalletConnectAccount(accounts);

    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      self.event.setWalletConnectAccount(accounts);
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
    });
  }

  async sendTransaction(attr: any): Promise<any> {
    try {
      const self = this;
      const network = this.cacheService.get('network');
      network === environment.NETWORK_TYPE.MAINNET? self.algoApiService.init(environment.ALGO_V2_MAINNET_URL) :
      self.algoApiService.init(environment.ALGO_V2_TESTNET_URL)
      const suggestedPrams = await self.algoApiService.makeTransactionWitParams(attr);
      const {txnsToSignArr, txnResp}=suggestedPrams;
      const preprareRes = await self.algoApiService.prepareTxn(txnsToSignArr);
      const { txnToSign, requestPayload } = preprareRes;
      // Send transaction
      const result = await self.connector.sendCustomRequest(requestPayload);
      result.transactionId=txnResp.insertedId;
      return { preprareRes, sendResp: result };
    } catch (error:any) {
      // Error returned when rejected
      console.error('Error in wallet connect send transaction', error);
      throw new Error(error.message || 'Error while sending transactions');
    }
  }
  async submitTransaction(attr: any): Promise<any> {
    const { preprareRes, sendResp } = attr;
    const {txnToSign}=preprareRes;
    const self = this;
    const indexToGroup = (index: number) => {
      for (let group = 0; group < txnToSign.length; group++) {
        const groupLength = txnToSign[group].length;
        if (index < groupLength) {
          return [group, index];
        }

        index -= groupLength;
      }

      throw new Error(`Index too large for groups: ${index}`);
    };
    const signedPartialTxns: Array<Array<Uint8Array | null>> = txnToSign.map(() => []);;
    sendResp.forEach((r: any, i: any) => {
      const [group, groupIndex] = indexToGroup(i);
      const toSign = txnToSign[group][groupIndex];

      if (r == null) {
        if (toSign.signers !== undefined && toSign.signers?.length < 1) {
          signedPartialTxns[group].push(null);
          return;
        }
        throw new Error(`Transaction at index ${i}: was not signed when it should have been`);
      }

      if (toSign.signers !== undefined && toSign.signers?.length < 1) {
        throw new Error(`Transaction at index ${i} was signed when it should not have been`);
      }

      const rawSignedTxn = Buffer.from(r, "base64");
      signedPartialTxns[group].push(new Uint8Array(rawSignedTxn));
    });
    const signedTxns: Uint8Array[][] = signedPartialTxns.map(
      (signedPartialTxnsInternal, group) => {
        return signedPartialTxnsInternal.map((stxn, groupIndex) => {
          if (stxn) {
            return stxn;
          }

          return (txnToSign[group][groupIndex].txn);
        });
      },
    );
    const signedTxnInfo: Array<Array<{
      txID: string;
      signingAddress?: string;
      signature: string;
    } | null>> = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
      return signedPartialTxnsInternal.map((rawSignedTxn, i) => {
        if (rawSignedTxn == null) {
          return null;
        }

        const signedTxn = algosdk.decodeSignedTransaction(rawSignedTxn);
        const txn = (signedTxn.txn as unknown) as algosdk.Transaction;
        const txID = txn.txID();
        const unsignedTxID: any = txnToSign[group][i].txn.txID();

        if (txID !== unsignedTxID) {
          throw new Error(
            `Signed transaction at index ${i} differs from unsigned transaction. Got ${txID}, expected ${unsignedTxID}`,
          );
        }

        if (!signedTxn.sig) {
          throw new Error(`Signature not present on transaction at index ${i}`);
        }

        return {
          txID,
          signingAddress: signedTxn.sgnr ? algosdk.encodeAddress(signedTxn.sgnr) : undefined,
          signature: Buffer.from(signedTxn.sig).toString("base64"),
        };
      });
    });

    console.log("Signed txn info:", signedTxnInfo);
    const submitRes = await self.algoApiService.submitTransaction(signedTxns[0]);
    console.log(submitRes);
    return submitRes;
  }
}