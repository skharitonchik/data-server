const Router = require('express');
const router = Router();
const currenciesController = require('../controllers/currencies.controller');

router.get('/currencies', currenciesController.getAllCurrencies);
router.post('/add-currency', currenciesController.addNewCurrency);

module.exports = router;
