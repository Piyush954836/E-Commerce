const jwt = require('jsonwebtoken');

const isLoggenIn = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) return res.status(401).json({ message: "Unauthorized" });

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch(error){
    res.clearCookie('token');
    return res.status(401).json({message: "Not authorized, Token failed"});
  }
}

module.exports = isLoggenIn;