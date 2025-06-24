const express = require('express');
const router = express.Router();
const getAllUsers = require('../controllers/adminController');
const {protected, adminOnly} = require('../middlewares/auth');

router.get('/users', protected, adminOnly, getAllUsers);


module.exports = router;