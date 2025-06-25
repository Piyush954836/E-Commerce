const express = require('express');
const router = express.Router();
const {register, login, logout, becomeSeller} = require('../controllers/userController');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/become-seller', isLoggedIn, becomeSeller);
router.get('/me', isLoggedIn, (req, res) => {
  res.json({ id: req.user.id });
});

module.exports = router;