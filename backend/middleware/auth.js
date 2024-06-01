const jwt = require('jsonwebtoken')

// Middleware pour vérifier l'authentification de l'utilisateur
module.exports = (req, res, next) => {
    try {
        // Extraction du token d'authentification du header de la requête
        const token = req.headers.authorization.split(' ')[1]; 
        // Vérification et décodage du token avec la clé secrète
        const decodedToken = jwt.verify(token, 'VIEUX_GRIMOIRES');
        // Récupération de l'ID de l'utilisateur à partir du token décodé
        const userId = decodedToken.userId;
        // Ajout de l'ID de l'utilisateur dans la requête pour une utilisation ultérieure
        req.auth = {
            userId: userId
        };
        // Appel à la fonction next pour passer au middleware suivant dans la chaîne de traitement
        next();
    } catch(error) {
        // En cas d'erreur lors de la vérification du token, renvoi d'un statut 401 avec l'erreur
        res.status(401).json({ error });
    }
};