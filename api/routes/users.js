const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.find({email: email})
        .exec()
        .then(users => {
            if (users.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            } else {
                if (password === "") {
                    return res.status(500).json({
                        message: "Password cannot be empty"
                    });
                }
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: email,
                        password: hash,
                    });
                    user
                    .save()
                    .then(result => {
                        res.status(200).json({
                            message: 'User created',
                            user: {
                                email: email,
                                password: password,
                            }
                        });
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    });
                });
            }
        })
        .catch(err => {
            return res.json(err);
        });
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email})
    .exec()
    .then( users => {
        const user = users[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result == false) {
                return res.status(500).json({
                    message: 'Invalid login'
                });
            }
            const token = jwt.sign({
                email: user.email,
                id: user._id,
            },
            "a secret key",
            {
                expiresIn: "1h",
            });
            return res.status(200).json({
                message: 'Auth successful',
                token: token,
                user: {
                    username: user.email
                }
            });
        });
        
    })
    .catch( result => {
        return res.status(500).json({
            message: 'Invalid login'
        });
    });
});

router.get('/profile', checkAuth, (req, res) => {
    User.find({_id: req.userData.id})
        .exec()
        .then(users => {
            const user = users[0];
            return res.status(200).json({email: user.email, hash: user.password});
        })
        .catch(error => {
            return res.status(500).json({
                message: 'Error'
            });
        });
})

module.exports = router;