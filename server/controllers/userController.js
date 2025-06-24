const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const {name, email, password} = req.body;
  const userExists = await User.findOne({email});
  if(userExists) return res.status(400).json({message: "User already exists"});

  const user = await User.create({name, email, password});
  const token = generateToken(user);
   res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 5*24*60*60*1000,
  });
  res.json({
    message: "Login Successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

exports.login = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if(!user || !(await user.matchPassword(password))){
    return res.status(401).json({message: "Invalid Credentils"});
  }

  const token = generateToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 5*24*60*60*1000,
  });

  res.json({
    message: "Login Successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  }).json({message: "Logged Out"});
}

exports.becomeSeller = async (req, res) => {
  try{
    const user = await User.findById(req.user._id);
    if(!user) return res.status(404).json({message: "User not found" });

    user.isSeller = true;
    user.save();
    res.json({message: "You are a seller now", user});
  }catch(err){
    res.status(500).json({message: "Server error"});
  }
}