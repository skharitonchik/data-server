const CommonController = require('./common.controller.js');
const envs = require('../config/envs.js');
const commonController = new CommonController(envs.currencies, 'CURRENCIES');

const getAllCurrencies = (req, res) => {
  commonController.getAll(req, res);
};

const addNewCurrency = (req, res) => {
  commonController.postData(req, res);
};

module.exports = {
  getAllCurrencies,
  addNewCurrency,
};
