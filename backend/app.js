const express = require ('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const app = express();

app.use(express.json());

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

module.exports = app;