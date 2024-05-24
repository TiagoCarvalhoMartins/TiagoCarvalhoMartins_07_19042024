const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth')
const { upload, resizeImage } = require('../middleware/sharp-config');
const bookController = require ('../controllers/book')

// Route pour créer un nouveau livre
//router.post('/', auth, multer, bookController.createBook);
router.post('/', auth, upload, resizeImage, bookController.createBook);

// Route pour obtenir tous les livres
router.get('/', bookController.getAllBooks);

// Route pour obtenir un livre par son ID
router.get('/:id', bookController.getBookById);

// Route pour obtenir les 3 livres avec la meilleure note moyenne
router.get('/bestrating', bookController.getBooksByBestRating);

// Route pour mettre à jour un livre par son ID
router.put('/:id', auth, upload, resizeImage, bookController.updateBook);

// Route pour supprimer un livre par son ID
router.delete('/:id', auth, bookController.deleteBookById);

module.exports = router;