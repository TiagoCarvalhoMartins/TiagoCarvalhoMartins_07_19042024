const Book = require('../models/Book');

// Créé un livre
exports.createBook = (req, res, next) => {
   
    const bookData = JSON.parse(req.body.book);
    const{ userId, title, author, year, genre, ratings } = bookData;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const defaultGrade = 0;
    const grade = ratings.length > 0 && ratings[0].grade !== undefined ? ratings[0].grade : defaultGrade;
    
    const book = new Book({
    userId: userId,
    title: title,
    author: author,
    imageUrl: imageUrl,
    year: year,
    genre: genre,
    ratings: [{ userId: userId, grade: grade }]
  });
  book.save().then(
      () => {
          res.status(201).json({
              message: 'Book saved successfully!'
            });
        }
    ).catch(
        (error) => {
        console.log(error)
      res.status(400).json({
        error: error
      });
    }
  );
};

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => {
        res.status(200).json(books);
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  };

  // Récupérer un livre par son ID
exports.getBookById = (req, res, next) => {
    const bookId = req.params.id;
    Book.findById(bookId)
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  };

  // Récupérer les 3 livres avec la meilleure note moyenne
exports.getBooksByBestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
      .then(books => {
        res.status(200).json(books);
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  };

  // Met à jour un livre existant
exports.updateBook = (req, res, next) => {
  const bookId = req.params.id;
  const { title, author, year, genre, grade } = req.body;

  // Vérifier si une image a été téléchargée
  if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      Book.findByIdAndUpdate(bookId, { title, author, imageUrl, year, genre, grade }, { new: true })
          .then(updatedBook => {
              res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
          })
          .catch(error => {
              res.status(400).json({ error: error.message });
          });
  } else {
      Book.findByIdAndUpdate(bookId, { title, author, year, genre, grade }, { new: true })
          .then(updatedBook => {
              res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
          })
          .catch(error => {
              res.status(400).json({ error: error.message });
          });
  }
};

// Supprimer un livre par son ID
exports.deleteBookById = (req, res, next) => {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
      .then(deletedBook => {
          if (!deletedBook) {
              return res.status(404).json({ message: 'Book not found' });
          }
          res.status(200).json({ message: 'Book deleted successfully!', deletedBook });
      })
      .catch(error => {
          res.status(500).json({ error: error.message });
      });
};