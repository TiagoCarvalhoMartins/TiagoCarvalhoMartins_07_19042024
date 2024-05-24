const express = require ('express');
const path = require('path');
//const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const bookController = require('./controllers/book');
const app = express();

// Autoriser toutes les requêtes CORS
app.use(cors());

app.use(express.json());

app.use('/images', express.static('images'));



mongoose.connect('mongodb+srv://carvalhomartinstiago:6TEOPTS4atbGLLO6@cluster0.7rk4nid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
  });

  app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;