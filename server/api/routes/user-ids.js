const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res) => {
    User.findOne({_id: req.userData.id})
    .exec()
    .then(user => {
        return res.status(200).json({
            email: user.email,
            id: user._id,
            signupAt: user.signupAt,
            lastLoginAt: user.lastLoginAt,
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            fail: 'error',
            error: err,
        });
    });
});

router.patch('/', checkAuth, async (req, res) => {
    console.log('patch request for id: ' + req.userData.id);
    let updatedFields = {};

    if (req.body.email) {
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!emailRegex.test(req.body.email.toLowerCase())) {
            return res.status(500).json({
                fail: "Invalid email"
            })
        }
        updatedFields.email = req.body.email.toLowerCase();
    }
    
    // update password
    if (req.body.password === "") {
        return res.status(500).json({
            fail: "Password cannot be empty"
        });
    }
    if (req.body.password) {
        console.log('provided password: ' + req.body.password);
        const hash = await bcrypt.hash(req.body.password, 10);
        if (!hash) {
            console.log('bcrypt error');
            return res.status(500).json({
                fail: 'error',
                error: {},
            });
        }
        console.log('bycrypt hash: ' + hash);
        updatedFields.hash = hash;
    }
    User.findByIdAndUpdate(req.userData.id, updatedFields, function(err, result) {
        if (err) {
            console.log(err);
            if (error.codeName === "DuplicateKey") {
                return res.status(500).json({fail: "Email already in use by another user"})
            }
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        }
        return res.status(200).json({
            success: "Updated successfully",
        });
    });
});

router.delete('/', checkAuth, (req, res) => {
    User.findOne({_id: req.userData.id})
    .exec()
    .then(user => {
        user.remove();
        return res.status(200).json({
            success: 'Deleted successfully'
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            fail: 'error',
            error: err,
        });
    });
});
module.exports = router;