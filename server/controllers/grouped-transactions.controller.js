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

function getTransactionsGroupedByDay(req, res) {
  const transactionsData = transactionsController.readData();
  const categoriesData = categoriesController.readData();
  const cardsData = cardsController.readData();
  const currenciesData = currenciesController.readData();
  const usersData = usersController.readData();
  const categoriesMap = new Map();
  const cardsMap = new Map();
  const currenciesMap = new Map();
  const usersMap = new Map();
  const groupedTransactions = {};
  const requestedUser = req.body.user;
  const requestedCategory = req.body.category;
  const requestedDateFrom = req.body.dateFrom ? dayjs(req.body.dateFrom) : null;
  const requestedDateTo = req.body.dateTo ? dayjs(req.body.dataTo) : null;

  const convertToMap = (data, map) => data.forEach((d) => map.set(d.id, d.name));

  convertToMap(categoriesData, categoriesMap);
  convertToMap(currenciesData, currenciesMap);
  convertToMap(usersData, usersMap);

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

    if(requestedUser && user !== requestedUser) {
      return;
    }

    if(requestedCategory && category !== requestedCategory) {
      return;
    }

    if (requestedDateFrom && requestedDateTo && !(dayjs(date).isSameOrAfter(requestedDateFrom, 'd') && dayjs(date).isSameOrBefore(requestedDateTo, 'd'))) {
      return;
    }

    if (category) {
      t.category = categoriesMap.get(category);
    }

    if (type === 20) {
      t.category = 'Перевод -';
    }

    if (type === 21) {
      t.category = 'Перевод +';
    }

    t.card = formattedCard;

    if (groupedTransactions.hasOwnProperty(formattedDate)) {
      groupedTransactions[formattedDate].transactions.push(t);

      if (type === 1) {
        if (groupedTransactions[formattedDate].plus[currency]) {
          groupedTransactions[formattedDate].plus[currency] += money;
        } else {
          groupedTransactions[formattedDate].plus[currency] = money;
        }
      }

      if (type === 0) {
        if (groupedTransactions[formattedDate].minus[currency]) {
          groupedTransactions[formattedDate].minus[currency] += money;
        } else {
          groupedTransactions[formattedDate].minus[currency] = money;
        }
      }
    } else {
      const plus = type === 1 ? { [currency]: money } : {};
      const minus = type === 0 ? { [currency]: money } : {};

      groupedTransactions[formattedDate] = { plus, minus, transactions: [t] };
    }
  });

  res.send(groupedTransactions);
  res.end();
}

module.exports = {
  getTransactionsGroupedByDay,
};
