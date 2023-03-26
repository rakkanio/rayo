'use strict'

import TransactionModel from "../models/Transaction.mjs"

const { createTransaction, updateTransaction, listTransaction } = TransactionModel


const updateTxn = async (request, response) => {
    try {
        const { body } = request
        const data = await updateTransaction(body)
        response.status(200).send({ message: 'success', data: data })
    } catch (err) {
        response.status(500).send({ isError: true, message: 'Error while saving Algo transaction' })
    }
}
const createTxn = async (request, response) => {
    try {
        const { body } = request
        const data = await createTransaction(body)
        response.status(200).send({ message: 'success', data: data })
    } catch (err) {
        response.status(500).send({ isError: true, message: 'Error while saving Algo transaction' })
    }
}

const list = async (request, response) => {
    try {
        const data = await listTransaction(request)
        response.status(200).send({ message: 'success', data: data })
    } catch (err) {
        respose.status(500).send({ isError: true, message: 'Error while saving Algo transaction' })
    }
}


const TransactionController = {
    updateTxn,
    list,
    createTxn
}
export default TransactionController