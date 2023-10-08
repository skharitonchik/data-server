const CommonController = require('./common.controller.js');
const envs = require('../config/envs.js');
const commonController = new CommonController(envs.categories, 'CATEGORIES');

const getAllCategories = (req, res) => {
  commonController.getAll(req, res);
};

const addNewCategory = (req, res) => {
  commonController.postData(req, res);
};
const updateCategory = (req, res) => {
  commonController.putData(req, res);
};

module.exports = {
  getAllCategories,
  addNewCategory,
  updateCategory,
};
