const Router = require('express');
const router = Router();
const filtersController = require('../controllers/filters.controller');

router.get('/filters', filtersController.getAllFilters);
router.post('/add-filter', filtersController.addNewFilter);
router.put('/update-filter', filtersController.updateFilter);

module.exports = router;
