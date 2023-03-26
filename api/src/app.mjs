import express from 'express'
import path from 'path'

import route from './routes/index.mjs'
import Server from './server.mjs'
import cors from 'cors'
import bodyParser from 'body-parser'
const __dirname = path.resolve()


const app = express()

app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false, limit: '5mb' }))
app.use(express.static(path.join(__dirname, 'public')))

//To allow cross-origin requests
app.use(cors())

//Route Prefixes
app.use('/', route)
Server(app)

export default app

