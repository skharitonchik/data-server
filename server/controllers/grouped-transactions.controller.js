const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const CommonController = require('./common.controller');
const envs = require('../config/envs');
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}

const transactionsController = new CommonController(envs.transactions, 'TRANSACTIONS');
const cardsController = new CommonController(envs.cards, 'CARDS');
const categoriesController = new CommonController(envs.categories, 'CATEGORIES');
const currenciesController = new CommonController(envs.currencies, 'CURRENCIES');
const usersController = new CommonController(envs.users, 'USERS');


const validateTransaction = (transactionConfig, reqBody) => {
  const { user, category, date } = transactionConfig;
  const requestedUser = reqBody.user;
  const requestedCategory = reqBody.category;
  const requestedDateFrom = reqBody.dateFrom ? dayjs(reqBody.dateFrom) : null;
  const requestedDateTo = reqBody.dateTo ? dayjs(reqBody.dateTo) : null;

  if (requestedUser && user !== requestedUser) {
    return false;
  }

  if (requestedCategory && category !== requestedCategory) {
    return false;
  }

  if (requestedDateFrom && requestedDateTo && (!dayjs(date).isSameOrAfter(requestedDateFrom, 'd') || !dayjs(date).isSameOrBefore(requestedDateTo, 'd'))) {
    return false;
  }

  return true;
};

const convertToMap = (data) => new Map(data.map(item => [item.id, item.name]));

function getTransactionsGroupedByDay(req, res) {
  const transactionsData = transactionsController.readData();
  const categoriesData = categoriesController.readData();
  const cardsData = cardsController.readData();
  const currenciesData = currenciesController.readData();
  const usersData = usersController.readData();
  const categoriesMap = convertToMap(categoriesData);
  const currenciesMap = convertToMap(currenciesData);
  const usersMap = convertToMap(usersData);
  const cardsMap = new Map();
  const allPlus = {};
  const allMinus = {};
  const dateGroups = {};

  const updateMoney = (moneyObj, money, currency) => {
    if (moneyObj[currency]) {
      moneyObj[currency] += money;
    } else {
      moneyObj[currency] = money;
    }
  };

  const updateAllPlus = (money, currency) => {
    if (!allPlus[currency]) {
      allPlus[currency] = 0;
    }

    allPlus[currency] += money;
  };

  const updateAllMinus = (money, currency) => {
    if (!allMinus[currency]) {
      allMinus[currency] = 0;
    }

    allMinus[currency] += money;
  };

  cardsData.forEach((card) => {
    cardsMap.set(card.id, {
      name: card.name,
      currency: currenciesMap.get(card.currency),
      user: usersMap.get(card.user),
    });
  });

  transactionsData.forEach((t) => {
    const { date, category, card, type, money } = t;
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedCard = cardsMap.get(card);
    const { currency, user } = formattedCard;

    if (!validateTransaction({ date, category, user }, req.body)) {
      return;
    }

    if(type === 20 || type === 21){
      return
    }

    if (category) {
      t.category = categoriesMap.get(category);
    }

    t.card = formattedCard;

    if (dateGroups.hasOwnProperty(formattedDate)) {
      dateGroups[formattedDate].transactions.push(t);

      if (type === 1) {
        updateMoney(dateGroups[formattedDate].plus, money, currency);
        updateAllPlus(money, currency);
      }

      if (type === 0) {
        updateMoney(dateGroups[formattedDate].minus, money, currency);
        updateAllMinus(money, currency);
      }
    } else {
      type === 1 && updateAllPlus(money, currency);
      type === 0 && updateAllMinus(money, currency);

      dateGroups[formattedDate] = {
        plus: type === 1 ? { [currency]: money } : {},
        minus: type === 0 ? { [currency]: money } : {},
        transactions: [t],
      };
    }
  });

  res.send({ allMinus, allPlus, dateGroups });
  res.end();
}

module.exports = {
  getTransactionsGroupedByDay,
};
