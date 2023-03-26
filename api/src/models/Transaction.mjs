'use strict'

import MongoOperationModel from '../helpers/MongoOperation.mjs'
import { MONGO } from '../constants/index.mjs'

const { create, update, list } = MongoOperationModel

const createTransaction = async (body) => {
    try {
        const data = await create(MONGO.COLLECTION.TRANSACTIONS, body)
        return data
    } catch (error) {
        console.log('Error while creating Algo transaction', error)
        throw new Error(error.message || error)
    }
}
const updateTransaction = async (body) => {
    try {
        let reqObj = {
            payload: body.payload,
            query: { transactionId: body.transactionId }
        }
        const data = await update(MONGO.COLLECTION.TRANSACTIONS, reqObj)
        return data
    } catch (error) {
        console.log('Error while updating transaction', error)
        throw new Error(error.message || error)
    }
}
const listTransaction = async (request) => {
    const { query } = request
    try {
        const queryObj = { from: query.account }
        const data = await list(MONGO.COLLECTION.TRANSACTIONS, queryObj)
        return data
    } catch (error) {
        console.log('Error while fetching transaction list', error)
        throw new Error(error.message || error)
    }
}

const TransactionModel = {
    createTransaction,
    updateTransaction,
    listTransaction

}

export default TransactionModel

