// Import des modules nécessaires
const mongoose = require('mongoose'); // Module Mongoose pour la gestion des schémas MongoDB
const uniqueValidator = require('mongoose-unique-validator'); // Module mongoose-unique-validator pour valider les champs uniques

// Schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Adresse email de l'utilisateur (obligatoire et unique)
    password: { type: String, required: true } // Mot de passe de l'utilisateur (obligatoire)
});

// Utilisation du plugin uniqueValidator pour valider les champs uniques dans le schéma
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model ('User', userSchema);