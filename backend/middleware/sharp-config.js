// Middleware pour gérer le téléchargement de fichiers avec Multer et le redimensionnement avec Sharp
const multer = require('multer'); // Module Multer pour le téléchargement de fichiers
const sharp = require('sharp'); // Module Sharp pour le redimensionnement d'images
const path = require('path'); // Module Path pour la manipulation des chemins de fichiers

// Types de fichiers autorisés avec leurs extensions correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de l'espace de stockage en mémoire avec Multer
const storage = multer.memoryStorage();

const imagePath = path.join(__dirname, '..', 'images');

// Middleware de téléchargement de fichier unique avec Multer
const upload = multer({ storage: storage }).single('image');

// Middleware de redimensionnement de l'image téléchargée avec Sharp
const resizeImage = (req, res, next) => {
  // Vérifier si aucun fichier n'a été téléchargé
  if (!req.file) {
    return next(); // Passer à l'étape suivante du middleware
  }

  // Générer un nom de fichier unique sans espaces ni caractères spéciaux
  const name = req.file.originalname.split(' ').join('_').split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '');
  const extension = MIME_TYPES[req.file.mimetype]; // Récupérer l'extension du fichier
  const filename = `${name}_${Date.now()}.${extension}`; // Construire le nom de fichier avec une estampille de temps
  //const filepath = path.join('images', filename); // Construire le chemin du fichier de destination
  const filepath = path.join(imagePath, filename);

  // Redimensionner l'image téléchargée avec Sharp
  sharp(req.file.buffer)
    .resize(500, 600) // Redimensionner l'image à la taille spécifiée
    .toFile(filepath, (err, info) => { // Enregistrer l'image redimensionnée sur le disque
      if (err) {
        return next(err); // Passer l'erreur à l'étape suivante du middleware
      }
      req.file.filename = filename; // Enregistrer le nom du fichier redimensionné dans la requête
      req.file.path = filepath;
      next(); // Passer à l'étape suivante du middleware
    });
};

module.exports = { upload, resizeImage };