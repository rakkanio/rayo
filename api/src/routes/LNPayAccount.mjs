'use strict'

import express from 'express'

import LNPayAccountController from '../controllers/LNPayAccount.mjs'
const { decode, updateLnPayTxn, getAccountInfo } = LNPayAccountController

const router = express.Router()

router.get('/account/info', getAccountInfo)
router.post('/decode', decode)
router.post('/account/draft-update', updateLnPayTxn)
export default router