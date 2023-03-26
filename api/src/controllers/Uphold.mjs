"use strict";

import UpholdModel from "../models/Uphold.mjs";
const { exchangeRateList } = UpholdModel;

const getExchangeRate = async (request, response) => {
  const { query } = request;
  const { USDMXN } = query;
  try {
    const data = await exchangeRateList({ USDMXN });
    response.status(200).send({ message: "success", data: data });
  } catch (err) {
    response.status(500).send({ isError: true, message: err.message });
  }
};

const UpholdController = {
  getExchangeRate,
};
export default UpholdController;
