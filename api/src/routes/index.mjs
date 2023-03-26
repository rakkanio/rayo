'use strict'

import express from 'express'
import AlgoNetworkMiddleware from '../middleware/AlgoNetwork.mjs'

import lnPayAccountRouter from './LNPayAccount.mjs'
import transactionRouter from './Transaction.mjs'

import upholdRouter from './Uphold.mjs'

const { initNetwork } = AlgoNetworkMiddleware


const app = express()

app.use('/api/account/', transactionRouter)
app.use('/api/lnpay/', initNetwork, lnPayAccountRouter)
app.use('/api/exchange/', upholdRouter)

export default app
