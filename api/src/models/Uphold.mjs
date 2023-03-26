"use strict"

import axios from "axios"

import { serverInfo } from "../config/index.mjs"
const { UPHOLD_API_URL } = serverInfo

const exchangeRateList = async (attr) => {
  try {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      url: UPHOLD_API_URL,
    }

    const list = await axios(options)
    const { data } = list
    const foundBid = data.find((item) => item.pair === attr.USDMXN)
    return foundBid
  } catch (err) {
    console.log("Error while fetching uphold list", err)
    throw new Error(err)
  }
}

const UpholdModel = {
  exchangeRateList,
}

export default UpholdModel
