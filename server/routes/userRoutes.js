const express = require('express');
const router = express.Router();
const {register, login, logout, becomeSeller} = require('../controllers/userController');
const {protected} = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/become-seller', protected, becomeSeller);

module.exports = router;