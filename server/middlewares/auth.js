const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminOnly = (req, res, next) => {
  if(req.user && req.user.role === 'admin'){
    next();
  }
  else{
    res.status(403).json({message: 'Admin Only'});
  }
};

const sellerOnly = (req, res, next) => {
  if(req.user && req.user.role === 'seller'){
    next();
  }
  else{
    res.status(403).json({message: "Only sellers allowed"});
  }
};

module.exports = { adminOnly, sellerOnly};