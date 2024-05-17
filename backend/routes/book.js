const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
console.log("book route OK")
const bookController = require ('../controllers/book')

// Route pour créer un nouveau livre
router.post('/', auth, multer, bookController.createBook);

// Route pour obtenir tous les livres
router.get('/', bookController.getAllBooks);

// Route pour obtenir un livre par son ID
router.get('/:id', bookController.getBookById);

// Route pour obtenir les 3 livres avec la meilleure note moyenne
router.get('/bestrating', bookController.getBooksByBestRating);

module.exports = router;