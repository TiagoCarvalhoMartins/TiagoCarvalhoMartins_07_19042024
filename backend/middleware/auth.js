const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken= jwt.verify(token, 'VIEUX_GRIMOIRES');
        const userID = decodedToken.userID;
        req.auth= {
            userID: userID
        };
        next();
    } catch(error) {
        res.status(401).json({ error })
    }
};