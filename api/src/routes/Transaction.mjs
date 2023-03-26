'use strict'

import express from 'express'
import TransactionController from '../controllers/Transaction.mjs'
const { list, updateTxn, createTxn } = TransactionController

const router = express.Router();

router.get('/transaction/list', list)
router.post('/transaction/draft-update', updateTxn)
router.post('/transaction', createTxn)
export default router;