'use strict'

import express from 'express'
import UpholdController from '../controllers/Uphold.mjs'
const { getExchangeRate} = UpholdController

const router = express.Router();

router.get('/rate', getExchangeRate)

export default router;