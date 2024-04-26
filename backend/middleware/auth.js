const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken= jwt.verify(token, 'VIEUX_GRIMOIRES');
        const userID = decodedToken.userId;
        req.auth= {
            userID: userID
        };
    } catch(error) {
        res.status(401).json({ error })
    }
};