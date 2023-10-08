const CommonController = require('./common.controller.js');
const envs = require('../config/envs.js');
const commonController = new CommonController(envs.cards, 'CARDS');
const usersCommonController = new CommonController(envs.users, 'USERS');
const currenciesCommonController = new CommonController(envs.currencies, 'CURRENCIES');

const getAllCards = (req, res) => {
  commonController.getAll(req, res);
};

const addNewCard = (req, res) => {
  commonController.postData(req, res);
};

const getFormattedCards = (req, res) => {
  const cardsData = commonController.readData();
  const currenciesData = currenciesCommonController.readData();
  const usersData = usersCommonController.readData();
  const currenciesMap = new Map();
  const usersMap = new Map();
  const convertToMap = (data, map) => data.forEach((d) => map.set(d.id, d.name));

  convertToMap(currenciesData, currenciesMap);
  convertToMap(usersData, usersMap);

  const formattedCards = cardsData.map((card) => ({
    ...card,
    currency: currenciesMap.get(card.currency),
    user: usersMap.get(card.user),
  }));

  res.send(formattedCards);
  res.end();
};

module.exports = {
  getAllCards,
  addNewCard,
  getFormattedCards,
};
