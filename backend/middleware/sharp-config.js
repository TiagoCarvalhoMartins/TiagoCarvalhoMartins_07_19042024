const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split(' ').join('_').split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '');
  const extension = MIME_TYPES[req.file.mimetype];
  const filename = `${name}_${Date.now()}.${extension}`;
  const filepath = path.join('images', filename);

  sharp(req.file.buffer)
    .resize(500, 600)
    .toFile(filepath, (err, info) => {
      if (err) {
        return next(err);
      }
      req.file.filename = filename;
      next();
    });
};

module.exports = { upload, resizeImage };