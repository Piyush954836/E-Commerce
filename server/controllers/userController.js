const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const {name, email, password} = req.body;
  const userExists = await User.findOne({email});
  if(userExists) return res.status(400).json({message: "User already exists"});

  const user = await User.create({name, email, password});
  const token = generateToken(user);
   res.cookie('token', token, {
    httpOnly: true,
    secure:  process.env.NODE_ENV === 'production',
    sameSite: 'lax',
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
    secure:  process.env.NODE_ENV === 'production',
    sameSite: 'lax',
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
    secure:  process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  }).json({message: "Logged Out"});
}

exports.becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update role
    user.role = "seller";
    await user.save();

    // Generate new token with updated role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN}
    );

    // Set it in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "You are a seller now", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};