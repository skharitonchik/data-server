const CommonController = require('./common.controller.js');
const envs = require('../config/envs.js');
const commonController = new CommonController(envs.users, 'USERS');

const getAllUsers = (req, res) => {
  commonController.getAll(req, res);
};

const addNewUser = (req, res) => {
  commonController.postData(req, res);
};

module.exports = {
  getAllUsers,
  addNewUser,
};
