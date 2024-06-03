const Book = require('../models/Book');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Créé un livre
exports.createBook = (req, res, next) => {
  try {
    // Parse les données du livre envoyées dans le corps de la requête
    const bookData = JSON.parse(req.body.book);
    // Déstructure les propriétés du livre à partir des données parsées
    const { userId, title, author, year, genre, ratings } = bookData;
    // Construit l'URL de l'image à partir des informations de la requête
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
    // Initialise la note par défaut
    const defaultGrade = 0;
    // Initialise le total des notes et le nombre de notes
    let totalGrade = 0;
    let numberOfRatings = 0;

    // Parcourt toutes les notes pour calculer le total et le nombre de notes valides
    for (const rating of ratings) {
      // Vérifie si la note existe
      if (rating.grade !== undefined) {
        // Ajoute la note au total et incrémente le compteur de notes
        totalGrade += rating.grade;
        numberOfRatings++;
      }
    }

    // Calcule la note moyenne si il y a des notes, sinon utilise la note par défaut
    const grade = numberOfRatings > 0 ? totalGrade / numberOfRatings : defaultGrade;
    
    // Crée une nouvelle instance de livre avec les données fournies
    const book = new Book({
      userId: userId,
      title: title,
      author: author,
      imageUrl: imageUrl,
      year: year,
      genre: genre,
      // Ajoute une note initiale avec la note calculée
      ratings: [{ userId: userId, grade: grade }]
    });

    // Sauvegarde le livre dans la base de données
    book.save()
      .then(() => {
        // Log un message de succès et envoie une réponse JSON au client
        console.log('Book saved successfully');
        res.status(201).json({ message: 'Book saved successfully!' });
      })
      .catch(error => {
        // Log une erreur en cas d'échec de la sauvegarde et envoie une réponse d'erreur au client
        console.error('Error saving book:', error);
        res.status(400).json({ error });
      });
  } catch (error) {
    // Log une erreur en cas d'exception lors de la création du livre et envoie une réponse d'erreur au client
    console.error('Error in createBook function:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  // Utilise la méthode find de Mongoose pour récupérer tous les documents de la collection de livres
  Book.find()
    .then(books => {
      // Si la récupération est réussie, renvoie une réponse JSON avec un statut 200 contenant tous les livres
      res.status(200).json(books);
    })
    .catch(error => {
      // Si une erreur se produit, renvoie une réponse JSON avec un statut 500 contenant le message d'erreur
      res.status(500).json({ error: error.message });
    });
};

// Récupérer un livre par son ID
exports.getBookById = (req, res, next) => {
  // Récupère l'ID du livre à partir des paramètres de la requête
  const bookId = req.params.id;
  
  // Utilise la méthode findById de Mongoose pour trouver le livre par son ID
  Book.findById(bookId)
    .then(book => {
      // Si aucun livre n'est trouvé, renvoie une réponse JSON avec un statut 404 et un message d'erreur
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      // Si le livre est trouvé, renvoie une réponse JSON avec un statut 200 contenant le livre
      res.status(200).json(book);
    })
    .catch(error => {
      // Si une erreur se produit, renvoie une réponse JSON avec un statut 500 contenant le message d'erreur
      res.status(500).json({ error: error.message });
    });
};

// Récupérer les 3 livres avec la meilleure note moyenne
exports.getBooksByBestRating = (req, res, next) => {
  // Utilise la méthode find de Mongoose pour récupérer tous les livres
  Book.find()
    // Trie les livres par note moyenne décroissante (du plus élevé au plus bas)
    .sort({ averageRating: -1 })
    // Limite le résultat à 3 livres
    .limit(3)
    // Si la requête réussit, renvoie une réponse JSON avec un statut 200 contenant les livres
    .then(books => {
      res.status(200).json(books);
    })
    // Si une erreur se produit, renvoie une réponse JSON avec un statut 500 contenant le message d'erreur
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

// Met à jour un livre existant
exports.updateBook = (req, res, next) => {
  // Récupère l'ID du livre à partir des paramètres de la requête
  const bookId = req.params.id;
  // Déstructure les propriétés du corps de la requête
  const { title, author, year, genre, grade } = req.body;

  // Vérifie si une image a été téléchargée
  if (req.file) {

    // Trouver le livre avant de le mettre à jour
    Book.findById(bookId)
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }

        // Extraire le nom de fichier de l'URL de l'image actuelle
        const imageUrl = book.imageUrl;
        const imageName = url.parse(imageUrl).pathname.split('/').pop();
        // Construire le chemin du fichier local sur le serveur
        const imagePath = path.join(__dirname, '..', 'images', imageName);

        // Supprimer l'image associée au livre du serveur
        fs.unlink(imagePath, err => {
          if (err) {
            console.error('Error deleting image:', err);
          }
        });

        // Si une nouvelle image est téléchargée, crée l'URL de l'image
        const newImageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        // Met à jour le livre avec la nouvelle image
        Book.findByIdAndUpdate(bookId, { title, author, imageUrl: newImageUrl, year, genre, grade }, { new: true })
          .then(updatedBook => {
            // Si la mise à jour réussit, renvoie une réponse JSON avec un statut 200 contenant le livre mis à jour
            res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
          })
          .catch(error => {
            // Si une erreur se produit, renvoie une réponse JSON avec un statut 400 contenant le message d'erreur
            res.status(400).json({ error: error.message });
          });
      })
      .catch(error => {
        // Si une erreur se produit lors de la recherche, renvoie une réponse JSON avec un statut 500 contenant le message d'erreur
        res.status(500).json({ error: error.message });
      });
  } else {
    // Si aucune image n'est téléchargée, met à jour le livre sans image
    Book.findByIdAndUpdate(bookId, { title, author, year, genre, grade }, { new: true })
      .then(updatedBook => {
        // Si la mise à jour réussit, renvoie une réponse JSON avec un statut 200 contenant le livre mis à jour
        res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
      })
      .catch(error => {
        // Si une erreur se produit, renvoie une réponse JSON avec un statut 400 contenant le message d'erreur
        res.status(400).json({ error: error.message });
      });
  }
};

// Supprimer un livre par son ID
exports.deleteBookById = (req, res, next) => {
  // Récupère l'ID du livre à partir des paramètres de la requête
  const bookId = req.params.id;

  // Trouve et supprime le livre par son ID
  Book.findByIdAndDelete(bookId)
      .then(deletedBook => {
          // Si le livre n'existe pas, renvoie une réponse avec un statut 404 et un message d'erreur
          if (!deletedBook) {
              return res.status(404).json({ message: 'Book not found' });
          }
          // Extraire le nom de fichier de l'URL de l'image
          const imageUrl = deletedBook.imageUrl;
          const imageName = url.parse(imageUrl).pathname.split('/').pop();
          // Construire le chemin du fichier local sur le serveur
          const imagePath = path.join(__dirname, '..', 'images', imageName);
          // Supprimer l'image associée au livre du serveur
          fs.unlink(imagePath, err => {
            if (err) {
              console.error('Error deleting image:', err);
            }
          });
          // Si le livre est supprimé avec succès, renvoie une réponse avec un statut 200 et un message de succès
          res.status(200).json({ message: 'Book deleted successfully!', deletedBook });
      })
      .catch(error => {
          // Si une erreur se produit lors de la suppression, renvoie une réponse avec un statut 500 et le message d'erreur
          res.status(500).json({ error: error.message });
      });
};


// Ajouter un rating à un livre
exports.addRating = async (req, res, next) => {
  try {
    // Récupère l'ID du livre à partir des paramètres de la requête
    const bookId = req.params.id;
    // Récupère l'ID de l'utilisateur et la note à partir du corps de la requête
    const { userId, rating } = req.body;

    // Vérifie que la note est un nombre valide
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value' });
    }

    // Cherche le livre par son ID dans la base de données
    const book = await Book.findById(bookId);

    // Si le livre n'existe pas, renvoie une réponse avec un statut 404 et un message d'erreur
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Vérifie si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find(grade => grade.userId.toString() === userId);

    // Si l'utilisateur a déjà noté ce livre, renvoie une réponse avec un statut 400 et un message d'erreur
    if (existingRating) {
      return res.status(400).json({ message: 'User has already rated this book' });
    }

    // Ajoute la nouvelle note au livre
    book.ratings.push({ userId, grade: rating });

    // Calcule la nouvelle note moyenne
    const sum = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
    book.averageRating = sum / book.ratings.length;

    // Sauvegarde le livre mis à jour dans la base de données
    await book.save();

    // Renvoie une réponse avec un statut 200 et un message de succès
    res.status(200).json({ message: 'Rating added successfully', userId, rating, book, id: bookId, _id: bookId });
  } catch (error) {
    // En cas d'erreur, affiche l'erreur dans la console et renvoie une réponse avec un statut 500 et un message d'erreur
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Server error' });
  }
};