// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST: "http://localhost:3003/api",
  ALERT_DESTROY_MAX_TIME: 8000,
  ALERT_DESTROY_MIN_TIME: 8000,
  ALGO_USDC_ASSET_ID: 31566704,
  WALLET_TYPE: {
    ALGO_SIGNER: "ALGO_SIGNER",
    MY_ALGO_WALLET: "MY_ALGO_WALLET",
    GEM_WALLET: "GEM_WALLET",
    WALLET_CONNECT: "WALLET_CONNECT"
  },
  ALGO_V2_MAINNET_URL: "https://mainnet-api.algonode.cloud",
  ALGO_V2_TESTNET_URL: "https://testnet-api.algonode.cloud",
  WALLET_CONNECT_BRIDGE_URL: "https://bridge.walletconnect.org",
  ALGO_WALLET_ADDRESS: "2MYVD6LAB5LKOILRVMWYPZKAMS67ILSAHNHZ2GQHOPHACOQELPUH7ZPOCM",
  ALGO_CONTRACT_ADDRESS: "UGZKP5PG7JKWRFTSCVAW76QGL7KYQSNXYFX5B3JGNDNALQASPHBCJD4OTU",
  GEM_HOT_WALLET: "rQDQytvKuTQ4MrvCBmo5f1WnZkV1dQuwox",
  GEM_WALLET_ISSUER: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  ALGO_APP_ID: 111826695,
  NETWORK_TYPE: {
    MAINNET: "MainNet",
    TESTNET: "TestNet"
  },
  ASSET_ID: {
    MainNet: 31566704,
    TestNet: 10458941
  },
  BILL_PAY_TYPE: {
    "O": "O",
    "N": "N"
  },
  CATEGORY: {
    "SERVICE": "SERVICE",
    "GIFT": "GIFT",
    "RECHARGE": "RECHARGE"
  },
  UPHOLD: {
    EXCHANGE_USDMXN: "USDMXN"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
