// Middleware pour vérifier que l'ID de l'utilisateur dans la requête correspond à celui de l'authentification
const checkUserId = (req, res, next) => {
  // Récupérer l'ID de l'utilisateur depuis le corps de la requête
  const userIdFromRequest = req.body.userId;
  // Récupérer l'ID de l'utilisateur depuis le localStorage
  const userIdFromAuth = req.auth.userId;
  // Vérifier si l'ID de l'utilisateur est présent dans la requête
  if (!userIdFromRequest) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found in request' });
  }
  // Vérifier si l'ID de l'utilisateur est présent dans l'authentification
  if (!userIdFromAuth) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found in authorization' });
  }
  // Vérifier si les ID de l'utilisateur dans la requête et dans l'authentification correspondent
  if (userIdFromAuth !== userIdFromRequest) {
    return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
  }
  // Passer à l'étape suivante du middleware
  next();
};

module.exports = checkUserId;