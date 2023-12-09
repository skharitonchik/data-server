const Router = require('express');
const router = Router();
const transactionsController = require('../controllers/transactions.controller');
const groupedTransactionsController = require('../controllers/grouped-transactions.controller');

router.get('/transactions', transactionsController.getAllTransactions);
router.get('/transactions-grouped', transactionsController.getTransactionsGroupByDate);
router.get('/transactions-by-day', groupedTransactionsController.getTransactionsGroupedByDay);
router.post('/transactions-by-day', groupedTransactionsController.getTransactionsGroupedByDay);
router.post('/transactions-by-day', groupedTransactionsController.getTransactionsGroupedByDay);
router.post('/add-transaction', transactionsController.addTransaction);
router.post('/add-transaction-transfer', transactionsController.addTransactionTransfer);

module.exports = router;
