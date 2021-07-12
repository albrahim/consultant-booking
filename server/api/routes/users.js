const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Profile = require('../models/profile');

const login = require('../utilities/login');

router.post('/validate', (req, res) => {
    login.validate({email: req.body.email, password: req.body.password}, function(err, result) {
        if (err) {
            return res.status(500).json({fail: 'error', error: err});
        }
        if (result.fail) {
            return res.status(500).json(result);
        }
        return res.status(200).json(result);
    });
});

router.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    login.validate({email: email, password: password}, function(err, result) {
        if (err) {
            return res.status(500).json({fail: 'error', error: err});
        }
        if (result.fail) {
            return res.status(500).json(result);
        }
        if (result.success) {
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
                    async function createProfile() {
                        let profile = await new Profile({user: result._id});
                        let savedProfile = await profile.save();
                    }
                    createProfile();

                    const token = login.issueToken(user);

                    return res.status(200).json({
                        success: 'User created',
                        token: token,
                        user: {
                            email: user.email,
                            id: user._id,
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
                const token = login.issueToken(user);

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