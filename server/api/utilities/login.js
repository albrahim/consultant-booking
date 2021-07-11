const jwt = require('jsonwebtoken');

function issueToken(user) {
    return jwt.sign({
        id: user._id
    },
    "a secret key",
    {
        expiresIn: "5h",
    });
}

module.exports = {
    issueToken: issueToken
}