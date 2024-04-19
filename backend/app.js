const express = require ('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://carvalhomartinstiago:6TEOPTS4atbGLLO6@cluster0.7rk4nid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res) => {
    res.json({ message: 'Requête reçu !'})
})
module.exports = app;