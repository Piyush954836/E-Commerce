const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protected = async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.user = await User.findById(decoded.id).select('-password');
      next();
    }
    catch{
      return res.status(401).json({message: "Not Authorized token failed"});
    }
  }
  else{
    return res.status(401).json({message: "Not Authorized no token"});
  }
};

const adminOnly = (req, res, next) => {
  if(req.user && req.user.role === 'admin'){
    next();
  }
  else{
    res.stattus(403).json({message: 'Admin Only'});
  }
};

const sellerOnly = (req, res, next) => {
  if(req.user && req.user.isSeller){
    next();
  }
  else{
    res.status(403).json({message: "Only sellers allowed"});
  }
};

module.exports = {protected, adminOnly, sellerOnly};