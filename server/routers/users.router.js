const Router = require('express');
const router = Router();
const usersController = require('../controllers/users.controller');

router.get('/users', usersController.getAllUsers);
router.post('/add-user', usersController.addNewUser);

module.exports = router;
