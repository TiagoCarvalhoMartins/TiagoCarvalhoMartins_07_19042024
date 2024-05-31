const mongoose = require ('mongoose');

<<<<<<< HEAD
const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: Number, required: true }
});

const bookSchema = mongoose.Schema ({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 }
=======

const bookSchema = mongoose.Schema ({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true},
    ratings: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
            grade: {type: Number, required: true}
    }],
    averageRating: { type: Number, default: 0}
>>>>>>> parent of de92fa7 (corretion adding book)
});

bookSchema.post('save', function(doc, next) {
    if (this.ratings.length > 0) {
        const sum = this.ratings.reduce((acc, curr) => acc + curr.grade, 0);
        this.averageRating = sum / this.ratings.length;
    } else {
        this.averageRating = 0;
    }
    this.save().then(() => next());
});

module.exports = mongoose.model ('Book', bookSchema);