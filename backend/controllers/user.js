const User = require ('../models/User');
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec bcrypt et un salt de 10 tours
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
        // Envoi d'une réponse avec un statut 201 et un message de succès si l'utilisateur est créé
        .then(() => { res.status(201).json({ message: 'Utilisateur créé !'}) })
        // Envoi d'une réponse avec un statut 400 et l'erreur en cas d'échec de la sauvegarde
        .catch(error => { res.status(400).json({ error }) });
    })
    // Envoi d'une réponse avec un statut 500 et l'erreur en cas d'échec du hachage
    .catch(error => { res.status(500).json({ error }) });
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données par email
    User.findOne({ email: req.body.email })
    .then(user => {
        // Si l'utilisateur n'est pas trouvé, renvoyer un statut 401 avec un message d'erreur
        if (user === null) {
            res.status(401).json({ message: 'Combinaison identifiant/mot de passe incorrecte' });
        } else {
            // Comparaison du mot de passe fourni avec le mot de passe haché de la base de données
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // Si le mot de passe n'est pas valide, renvoyer un statut 401 avec un message d'erreur
                if (!valid) {
                    res.status(401).json({ message: 'Combinaison identifiant/mot de passe incorrecte' });
                } else {
                    // Si le mot de passe est valide, renvoyer un statut 200 avec l'ID de l'utilisateur et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'VIEUX_GRIMOIRES', // Clé secrète pour signer le token
                            { expiresIn: '24h' } // Le token expire au bout de 24 heures
                        )
                    });
                }
            })
            // En cas d'erreur lors de la comparaison des mots de passe, renvoyer un statut 500 avec l'erreur
            .catch(error => { res.status(500).json({ error }) });
        }
    })
    // En cas d'erreur lors de la recherche de l'utilisateur dans la base de données, renvoyer un statut 500 avec l'erreur
    .catch(error => {
        res.status(500).json({ error });
    });
};