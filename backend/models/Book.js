// Schéma de notation d'un livre
const mongoose = require('mongoose'); // Module Mongoose pour la gestion des schémas MongoDB

// Schéma de notation individuelle pour un livre
const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Identifiant de l'utilisateur ayant noté le livre
    grade: { type: Number, required: true } // Note attribuée par l'utilisateur au livre
});

// Schéma de livre
const bookSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Identifiant de l'utilisateur propriétaire du livre
    title: { type: String, required: true, unique: true }, // Titre du livre (unique)
    author: { type: String, required: true }, // Auteur du livre
    imageUrl: { type: String, required: true }, // URL de l'image du livre
    year: { type: Number, required: true }, // Année de publication du livre
    genre: { type: String, required: true }, // Genre du livre
    ratings: [ratingSchema], // Liste des notations du livre selon le schéma de notation
    averageRating: { type: Number, default: 0 } // Note moyenne du livre (par défaut à 0)
});

// Middleware exécuté avant l'enregistrement d'un livre pour calculer sa note moyenne
bookSchema.pre('save', function(next) {
    if (this.ratings.length > 0) { // Vérifier s'il y a des notations pour ce livre
        const sum = this.ratings.reduce((acc, curr) => acc + curr.grade, 0); // Calcul de la somme des notes
        this.averageRating = sum / this.ratings.length; // Calcul de la note moyenne
    } else {
        this.averageRating = 0; // Si aucune notation, la note moyenne est mise à zéro
    }
    next(); // Passer à l'étape suivante du middleware
});

// Méthode pour mettre à jour la note moyenne d'un livre
bookSchema.methods.updateAverageRating = async function() {
    if (this.ratings.length > 0) { // Vérifier s'il y a des notations pour ce livre
        const sum = this.ratings.reduce((acc, curr) => acc + curr.grade, 0); // Calcul de la somme des notes
        this.averageRating = sum / this.ratings.length; // Calcul de la note moyenne
    } else {
        this.averageRating = 0; // Si aucune notation, la note moyenne est mise à zéro
    }
    await this.save(); // Enregistrer les modifications de la note moyenne dans la base de données
};

module.exports = mongoose.model ('Book', bookSchema);