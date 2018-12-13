const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const tokenData = req.headers.authorization;
    if (!tokenData) {
        return res.status(401).json({error: 'Unauthorized request'});
    }
    const token = tokenData.split(' ')[1];
    if (token && token.trim() && token.trim().length) {
        try {
            req.userData = jwt.verify(token, process.env.JWT_KEY);
            next();
        } catch (e) {
            return res.status(401).json({
                error: "Unauthorized request data"
            });
        }
    } else {
        return res.status(401).json({
            error: "Unauthorized " + tokenData
        });
    }
};
