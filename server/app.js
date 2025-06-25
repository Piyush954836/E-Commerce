const express = require('express');
const cors = require('cors');
const cookieParse = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const jwt = require('jsonwebtoken');
const isLoggenIn = require('./middlewares/isLoggedIn');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParse());
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'pages', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'pages', 'login.html'));
});

app.get('/product', isLoggenIn, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'pages', 'product.html'));
});

app.get('/seller', isLoggenIn, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'pages', 'seller.html'));
});

app.get('/profile', isLoggenIn, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'pages', 'profile.html'));
});

app.get('/check-auth',isLoggenIn, (req, res) => {
  res.json({loggedIn: true, user: req.user});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
  console.log((`Server running on port ${PORT} `));
});