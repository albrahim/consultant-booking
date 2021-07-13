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
            console.log(err);
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
    const inputProfile = req.body.profile ? req.body.profile : {};

    login.validate({email: email, password: password}, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({fail: 'error', error: err});
        }
        if (result.fail) {
            return res.status(500).json(result);
        }
        if (result.success) {
            if ((typeof inputProfile) != 'object') {
                return res.status(500).json({fail: 'Invalid profile object'});
            }
            if (inputProfile.gender && !['male', 'female'].includes(inputProfile.gender)) {
                return res.status(500).json({
                    fail: 'Wrong gender value provided'
                });
            }
            if (inputProfile.firstName == "" || inputProfile.lastName == "") {
                return res.status(500).json({
                    fail: 'Wrong name value provided'
                });
            }
            if (inputProfile.major == "") {
                return res.status(500).json({
                    fail: 'Wrong major value provided'
                });
            }

            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({fail: 'error', error: err});
                }
                const userId = new mongoose.Types.ObjectId();
                new Profile({
                    user: userId,
                    firstName: inputProfile.firstName,
                    lastName: inputProfile.lastName,
                    gender: inputProfile.gender,
                    major: inputProfile.major,
                })
                .save()
                .then(profile => {
                    return new User({
                        _id: userId,
                        email: email,
                        hash: hash,
                        signupAt: new Date(),
                        lastLoginAt: new Date(),
                        profile: profile._id,
                    })
                    .save()
                    .then(user => {
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
                        console.log(err);
                        res.status(500).json({fail: 'error', error: err});
                    });
                })
                .catch(err => {
                    console.log(err);
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