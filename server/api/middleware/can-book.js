const User = require('../models/user');

module.exports = (req, res, next) => {
    if (!req.userData) {
        throw new Error('check-auth needed for using can-book middleware');
    }
    User.findById(req.userData.id, function(err, user) {
        if (err) {
            return res.status(500).json({
                fail: 'error',
                error: err,
            })
        }
        const profile = user.profile;
        if (profile == null || !profile.firstName || !profile.lastName || !profile.gender || !profile.major) {
            return res.status(500).json({
                fail: "Trainee can not book without complete profile"
            });
        }
        return next();
    });
};