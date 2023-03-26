'use strict'

import xrpl from 'xrpl'
import axios from 'axios'

import SERVER_CONFIG from '../config/SERVER_CONFIG.mjs'
import TransactionModel from '../models/Transaction.mjs'

const { LNPAY_API_KEY, LNPAY_DECODE_API, LNPAY_WALLET_URL, LNPAY_WALLET_ADDRESS } = SERVER_CONFIG

const { createTransaction, updateTransaction } = TransactionModel


const initialize = async (server) => {
  global.algoClient = new xrpl.Client(server)
  await algoClient.connect()
}
const fetchAccount = async (attr) => {
    const { account } = attr
    try {
      const xrpResponse = await algoClient.request({
        "command": "account_info",//
        "account": account,
        "ledger_index": "validated"
      })
      const usdResponse = await algoClient.request({
        "command": "account_lines",//
        "account": account,
        "ledger_index": "validated"
      })
      let usdAmountObj = usdResponse.result.lines.find(item => item.currency === 'USD')
      console.log(JSON.stringify(usdAmountObj))
      return { xrpResponse, usdAmountObj }
  
    } catch (err) {
      console.log('Error while fetching account info', err)
      throw new Error(err)
    }
  }
  

const getExchangeRate = async () => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            url: SERVER_CONFIG.UPHOLD_API_URL,
        }
        const upholdResult = await axios(options)
        return upholdResult.data
    } catch (err) {
        console.log('Error while fetching uphold info', err)
        throw new Error('Error while fetching uphold info, please try after sometime')
    }
}


const decodeInvoice = async (reqObj) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': LNPAY_API_KEY
            },
            url: `${LNPAY_DECODE_API}?payment_request=${reqObj.paymentRequest}`,
        }

        const decodedResult = await axios(options)
        const payload = {
            paymentRequest: reqObj.paymentRequest,
            decodedInfo: decodedResult.data,
            satAmount: decodedResult.data.num_satoshis,
            sourceWallet: 'LNPay',
            status: 'initiated',
            createdAt: new Date().toISOString()
        }
        const transactionInfo = await createTransaction(payload)
        return {
            decodedResult: decodedResult.data,
            transactionId: transactionInfo.insertedId
        }
    } catch (err) {
        console.log('Error while decoding invoice account info', err)
        throw new Error('Error while decoding invoice account info, please try after sometime')
    }
}

const calculateSatsToUsdcConversion = async (reqObj) => {
    try {
        const foundAsk = reqObj.exchangeResult.find(item => item.pair === SERVER_CONFIG.UPHOLD_USDC_PAIR)
        if (foundAsk) {
            let usdcAmount = Number(((Number(reqObj.data.decodedResult.num_satoshis) / 100000000) * foundAsk.ask)).toFixed(2)
            const resResult = {
                usdcAmount: usdcAmount,
                satAmount: reqObj.data.decodedResult.num_satoshis,
                destination: SERVER_CONFIG.ALGO_WALLET_ADDRESS,
                transactionId: reqObj.data.transactionId
            }
            const draft = {
                transactionId: reqObj.data.transactionId,
                payload: {
                    usdcAmount: usdcAmount,
                    destination: SERVER_CONFIG.ALGO_WALLET_ADDRESS,
                    pair: foundAsk.ask,
                    transactionId: reqObj.data.transactionId
                }
            }
            // await updateTransaction(draft)
            return resResult
        }
    } catch (err) {
        console.log('Error while converting assets', err)
        throw new Error('Error while converting assets, please try after sometime')
    }
}

const payInvoice = async (reqObj) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': LNPAY_API_KEY
            },
            url: `${LNPAY_WALLET_URL}/wallet/${LNPAY_WALLET_ADDRESS}/withdraw`,
            data: { payment_request: reqObj.paymentRequest },
            json: true
        }

        const paidInvoiceResult = await axios(options)
        return paidInvoiceResult
    } catch (err) {
        console.log('Error while paying invoice', err.response)
        // const draft = {
        //     transactionId: reqObj.transactionId,
        //     payload: {
        //         invoice: {
        //             request: {
        //                 path: err.request.path
        //             },
        //             response: {
        //                 error: err.response.data
        //             }
        //         },
        //         transactionId: reqObj.transactionId
        //     }
        // }
        // await updateTransaction(draft)
        throw new Error('Error while paying invoice, please try after sometime')
    }
}
const LNPayAccountModel = {
    decodeInvoice,
    getExchangeRate,
    calculateSatsToUsdcConversion,
    payInvoice,
    initialize,
    fetchAccount
}

export default LNPayAccountModel

