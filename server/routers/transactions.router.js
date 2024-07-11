const Router = require('express');
const router = Router();
const transactionsController = require('../controllers/transactions.controller');
const groupedTransactionsController = require('../controllers/grouped-transactions.controller');
const transactionsByMonth = require('../controllers/year-grouped-transactions.controller');
const CommonController = require('../controllers/common.controller');
const envs = require('../config/envs');

router.get('/transactions', transactionsController.getAllTransactions);
router.get('/transactions-grouped', transactionsController.getTransactionsGroupByDate);
router.get('/transactions-by-day', groupedTransactionsController.getTransactionsGroupedByDay);
router.post('/transactions-by-month', (req, res) => {
  const transactionsController = new CommonController(envs.transactions, 'TRANSACTIONS');
  const categoriesController = new CommonController(envs.categories, 'CATEGORIES');
  const cardsController = new CommonController(envs.cards, 'CARDS');
  const currenciesController = new CommonController(envs.currencies, 'CURRENCIES');

  const transactions = transactionsController.readData();
  const categories = categoriesController.readData();
  const cards = cardsController.readData();
  const currencies = currenciesController.readData();

  try {
    const transactionsProcessed = transactionsByMonth.processTransactions(transactions, categories, cards, currencies);
    res.send(transactionsProcessed);
  } catch (e) {
    console.error('Error occurred while processing transactions:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/transactions-by-day', groupedTransactionsController.getTransactionsGroupedByDay);
router.post('/add-transaction', transactionsController.addTransaction);
router.post('/add-transaction-transfer', transactionsController.addTransactionTransfer);

module.exports = router;
