const jwt = require('jsonwebtoken');
const user = require('../models/user');

// issue bearer token for user
function issueToken(user) {
    return jwt.sign({
        id: user._id
    },
    "a secret key",
    {
        expiresIn: "5h",
    });
}

// ensure login info are valid for user registration
function validate({email, password}, cb) {
    email = (email ? email.toLowerCase() : null);
    user.findOne({ email: email }, function(err, doc) {
        if (err) {
            return cb(err, null);
        }
        if (doc) {
            return cb(null, { fail: 'Email already in use' });
        }
        if (!email) {
            return cb(null, { fail: "Email cannot be empty" });
        }
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!emailRegex.test(email)) {
            return cb(null, { fail: "Invalid email format" });
        }
        if (!password) {
            return cb(null, { fail: "Password cannot be empty" });
        }
        cb(null, { success: "Valid email and password" });
    });
}

module.exports = {
    issueToken: issueToken,
    validate: validate,
}