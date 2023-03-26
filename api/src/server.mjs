'use strict'

import { serverInfo, MongoClient } from './config/index.mjs'


const { connection } = MongoClient

const Server = async (app) => {
    try {
        await connection()
        await app.listen(serverInfo.PORT)
        console.log(`[Info] Server Started Successfully! Listening on Port: ${serverInfo.PORT}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default Server
