const checkUserId = (req, res, next) => {
    const userIdFromRequest = req.body.userId; // Récupérer l'ID de l'utilisateur depuis le corps de la requête
    const userIdFromAuth = req.auth.userId; // Récupérer l'ID de l'utilisateur depuis le localStorage
    console.log("111", userIdFromAuth, userIdFromRequest)
    if (!userIdFromRequest) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found in request' });
    }
    if (!userIdFromAuth) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found in authorization' });
    }
    if (userIdFromAuth !== userIdFromRequest) {
      return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
    }
    next(); // Passer à l'étape suivante du middleware
  };
  
  module.exports = checkUserId;