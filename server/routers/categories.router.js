const Router = require('express');
const router = Router();
const categoriesController = require('../controllers/categories.controller');

router.get('/categories', categoriesController.getAllCategories);
router.get('/categories-settings', categoriesController.getCategoriesSettings);
router.post('/add-category', categoriesController.addNewCategory);
router.put('/update-category', categoriesController.updateCategory);

module.exports = router;
