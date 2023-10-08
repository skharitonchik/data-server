const Router = require('express');
const router = Router();
const cardsController = require('../controllers/cards.controller');

router.get('/cards', cardsController.getFormattedCards);
router.post('/card-add', cardsController.addNewCard);

module.exports = router;
