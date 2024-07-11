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

const getCategoriesSettings = (req, res) => {
  const categories = commonController.readData();

  categories.sort((a, b) => a.type < b.type ? 1 : -1);

  const categoriesNames = categories.map(c => ({
    name: c.name,
    type: c.type,
  }));

  res.send(categoriesNames);
  res.end();
};

module.exports = {
  getAllCategories,
  addNewCategory,
  updateCategory,
  getCategoriesSettings,
};
