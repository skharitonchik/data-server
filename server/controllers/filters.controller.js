const CommonController = require('./common.controller.js');
const envs = require('../config/envs.js');
const commonController = new CommonController(envs.filters, 'FILTERS');

const getAllFilters = (req, res) => {
  commonController.getAll(req, res);
};

const addNewFilter = (req, res) => {
  commonController.postData(req, res);
};

const updateFilter = (req, res) => {
  commonController.putData(req, res);
};

module.exports = {
  getAllFilters,
  addNewFilter,
  updateFilter,
};
