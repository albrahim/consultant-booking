const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, 'a secret key');
        req.userData = decoded;
        User.find({_id: req.userData.id})
        .exec()
        .then(users => {
            if (users.length == 1) {
                next();
            }
            else {
                return res.status(401).json({
                    fail: 'Auth failed'
                });
            }
        })
        .catch(err => {
            return res.status(401).json({
                fail: 'error',
                error: err,
            });
        });
        
    } catch (error) {
        return res.status(401).json({
            fail: 'Auth failed'
        });
    }
};