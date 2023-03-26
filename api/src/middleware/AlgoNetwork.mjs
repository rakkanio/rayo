'use strict'
import ALGO from '../constants/ALGO_CONSTANT.mjs'
import LnpayAccountModel from '../models/LNPayAccount.mjs'

const { initialize } =  LnpayAccountModel

const initNetwork = async (request, response, next) => {
    const { network } = { ...request.body, ...request.query }
    if (network === ALGO.NETWORK_TYPE.MAINNET) {
        await initialize('wss://xrplcluster.com/')
    } else {
        // overriding mainent asset id with testnet asset id
        await initialize('wss://testnet.xrpl-labs.com/')
    }
    next()
}

const AlgoNetworkMiddleware = {
    initNetwork
}

export default AlgoNetworkMiddleware

