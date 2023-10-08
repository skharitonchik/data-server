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

const commonController = new CommonController(envs.transactions, 'TRANSACTIONS');
const cardsController = new CommonController(envs.cards, 'CARDS');
const getAllTransactions = (req, res) => {
  commonController.getAll(req, res);
};

const getTransactionsGroupByDate = (req, res) => {
  const data = commonController.readData();
  const dateFrom = req.query.dateFrom ? dayjs(req.query.dateFrom) : null;
  const dateTo = req.query.dateTo ? dayjs(req.query.dateTo) : null;

  const resultData = data.filter((transaction) => {
    const transactionDate = dayjs(transaction.date);

    if (dateFrom && dateTo && dateFrom.isSameOrAfter(transactionDate) && dateTo.isSameOrBefore(transactionDate)) {
      console.info('%c  SERGEY transactionDate', 'background: #222; color: #bada55', transactionDate);
      return transaction;
    }

    if (dateFrom && dateFrom.isSameOrAfter(transactionDate, 'd')) {
      return transaction;
    }

    if (dateTo && dateTo.isSameOrBefore(transactionDate)) {
      return transaction;
    }
  });

  res.send(resultData);
  res.end();
};

const addTransaction = (req, res) => {
  const transactionsData = commonController.readData();
  const cardsData = cardsController.readData();

  const { card, type, money, date, category, notes } = req.body;

  console.log(`POST: TRANSACTIONS add transaction request`);

  if (type !== 0 && type !== 1) {
    res.send(JSON.stringify('Wrong type set, this request working only with 1 or 0'));
    return;
  }

  const savedCard = cardsData.find((c) => c.id === card);

  if (type === 1) {
    savedCard.money = (parseFloat(savedCard.money) + parseFloat(money)).toFixed(2);
  }

  if (type === 0) {
    savedCard.money = (parseFloat(savedCard.money) - parseFloat(money)).toFixed(2);

    console.info('%c  SERGEY money', 'background: #222; color: #bada55', money);
    console.info('%c  SERGEY savedCard.money', 'background: #222; color: #bada55', savedCard.money);
  }

  transactionsData.push({
    id: crypto.randomUUID(),
    date,
    card,
    category,
    money,
    type,
    notes,
  });

  cardsController.updateData(cardsData);
  commonController.updateData(transactionsData, res);
};

const addTransactionTransfer = (req, res) => {
  const transactionsData = commonController.readData();
  const cardsData = cardsController.readData();

  const { from, to } = req.body;

  console.log(`POST: TRANSACTIONS add transaction-transfer request`);

  const fromCard = from.card;
  const fromMoney = from.money;
  const toCard = to.card;
  const toMoney = to.money;

  const savedFromCard = cardsData.find((c) => c.id === fromCard);
  const savedToCard = cardsData.find((c) => c.id === toCard);

  savedFromCard.money = (parseFloat(savedFromCard.money) - parseFloat(fromMoney)).toFixed(2);
  savedToCard.money = (parseFloat(savedToCard.money) + parseFloat(toMoney)).toFixed(2);

  transactionsData.push({
    id: crypto.randomUUID(),
    ...from,
    type: 20,
  });

  transactionsData.push({
    id: crypto.randomUUID(),
    ...to,
    type: 21,
  });

  cardsController.updateData(cardsData);
  commonController.updateData(transactionsData, res);
};

module.exports = {
  getAllTransactions,
  getTransactionsGroupByDate,
  addTransaction,
  addTransactionTransfer,
};
