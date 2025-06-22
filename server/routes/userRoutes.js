const express = require('express');
const router = express();
const User = require('../models/User');

router.post('/register', async (req, res)=>{
  const {name, email, password} = req.body();
  const user = await User.create({name, email, password});
  res.json(user);
});

router.post('/login', async (req, res)=>{
  const {email, password} = req.body();
  const user = await User.findOne({email, password});
  if(!user) return res.status(400).json("Invalid credentials");
  res.json({message: "Login Successfully", user});
})

module.exports = router;