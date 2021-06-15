const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res) => {
    User.findOne({_id: req.userData.id})
    .exec()
    .then(user => {
        return res.status(200).json({
            email: user.email,
            signupAt: user.signupAt,
            lastLoginAt: user.lastLoginAt,
        })
    });
});

router.patch('/', checkAuth, (req, res) => {
    User.findOne({_id: req.userData.id})
    .exec()
    .then(user => {
        if (req.body.email) {
            user.email = req.body.email.toLowerString();
            user.save()
        }
        if (req.body.password) {
            bcrypt.hash(req.body.password, 10, (error, hash) => {
                if (error) {
                    return res.status(500).json(error);
                }
                console.log(hash);
                user.password = hash;
                user.save();
            });
        }
        return res.status(200).json({
            message: "Login information updated"
        });
    })
    .catch(error => {
        return res.status(500).json(error); 
    });
    
});

module.exports = router;