const checkUserId = (req, res, next) => {
    const userIdFromRequest = req.body.userId; // Récupérer l'ID de l'utilisateur depuis le corps de la requête
    const userIdFromLocalStorage = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur depuis le localStorage
    if (!userIdFromLocalStorage) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found in localStorage' });
    }
    if (userIdFromRequest !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
    }
    next(); // Passer à l'étape suivante du middleware
  };
  
  module.exports = checkUserId;