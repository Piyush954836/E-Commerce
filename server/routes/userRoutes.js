const express = require('express');
const router = express();
const {register, login, becomeSeller} = require('../controllers/userController');
const protected = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/become-seller', protected, becomeSeller);

module.exports = router;