'use strict'

import LNPayAccountModel from "../models/LNPayAccount.mjs"
import TransactionModel from "../models/Transaction.mjs"

const { updateTransaction } = TransactionModel
const { decodeInvoice, getExchangeRate, calculateSatsToUsdcConversion, payInvoice, fetchAccount } = LNPayAccountModel

const getAccountInfo = async (request, response) => {
    const { query } = request
    const { account, network } = query
    try {
        const data = await fetchAccount({ account, network })
        response.status(200).send({ message: 'success', data: data })
    } catch (err) {
        response.status(500).send({ isError: true, message: err.message })
    }
}

const decode = async (request, response) => {
    const { body } = request
    try {
        const data = await decodeInvoice({ paymentRequest: body.paymentRequest })
        const exchangeResult = await getExchangeRate()
        const conversionResult = await calculateSatsToUsdcConversion({ data: data, exchangeResult: exchangeResult })
        response.status(200).send({ message: 'success', data: conversionResult })
    } catch (err) {
        response.status(500).send({ isError: true, message: err.message || 'Error while fetching account details' })
    }
}

const updateLnPayTxn = async (request, response) => {
    try {
        const { body } = request
        const invoiceResult = await payInvoice(body)
        // body.payload.invoice = invoiceResult.data
        // const data = await updateTransaction(body)
        response.status(200).send({ message: 'success' })
    } catch (err) {
        response.status(500).send({ isError: true, message: 'Error while updating LnPay transaction' })
    }
}



const LNPayAccountController = {
    decode,
    updateLnPayTxn,
    getAccountInfo
}
export default LNPayAccountController