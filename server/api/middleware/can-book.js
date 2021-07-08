const Profile = require('../models/profile');

module.exports = (req, res, next) => {
    if (!req.userData) {
        throw new Error('check-auth needed for using can-book middleware');
    }
    Profile.findOne({user: req.userData.id}, function(err, doc) {
        if (err) {
            return res.status(500).json({
                fail: 'error',
                error: err,
            })
        }
        if (doc == null || !doc.firstName || !doc.lastName || !doc.gender || !doc.major) {
            return res.status(500).json({
                fail: "Trainee can not book without complete profile"
            });
        }
        return next();
    });
};