const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res) => {
    const email = (req.body.email ? req.body.email.toLowerCase() : "");
    const password = req.body.password;

    User.find({email: email})
        .exec()
        .then(users => {
            if (users.length >= 1) {
                return res.status(409).json({
                    fail: 'Email already exists'
                });
            } else {
                if (password === "") {
                    return res.status(500).json({
                        fail: "Password cannot be empty"
                    });
                }
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({fail: 'error', error: err});
                    }
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: email,
                        hash: hash,
                        signupAt: new Date(),
                        lastLoginAt: new Date()
                    });
                    user
                    .save()
                    .then(result => {
                        res.status(200).json({
                            success: 'User created',
                            user: {
                                email: user.email,
                                signupAt: user.signupAt,
                                lastLoginAt: user.lastLoginAt,
                            }
                        });
                    })
                    .catch(err => {
                        res.status(500).json({fail: 'error', error: err});
                    });
                });
            }
        })
        .catch(err => {
            return res.json({fail: 'error', error: err});
        });
});

router.post('/login', (req, res, next) => {
    const email = (req.body.email ? req.body.email.toLowerCase() : "");
    const password = req.body.password;
    User.find({email: email})
    .exec()
    .then( users => {
        const user = users[0];
        bcrypt.compare(password, user.hash, (err, result) => {
            if (err) {
                return res.status(500).json({fail: 'error', error: err});
            }
            if (result == false) {
                return res.status(401).json({
                    fail: 'Invalid login'
                });
            }

            user.lastLoginAt = new Date();
            user.save().then(result => {
                const token = jwt.sign({
                    id: user._id
                },
                "a secret key",
                {
                    expiresIn: "5h",
                });

                return res.status(200).json({
                    success: 'Auth successful',
                    token: token,
                    user: {
                        email: user.email,
                        signupAt: user.signupAt,
                        lastLoginAt: user.lastLoginAt,
                    }
                });
            })
            .catch(err => {
                res.status(500).json({fail: 'error', error: err})
            });
        });
        
    })
    .catch( result => {
        return res.status(401).json({
            fail: 'Invalid login'
        });
    });
});

module.exports = router;