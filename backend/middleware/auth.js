const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken= jwt.verify(token, 'VIEUX_GRIMOIRES');
        const userId = decodedToken.userID;
        req.auth= {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error })
    }
};