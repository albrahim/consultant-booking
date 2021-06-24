const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Profile = require('../models/profile')

const checkAuth = require('../middleware/check-auth');

router.put('/', checkAuth, (req, res) => {
    Profile.find({user: req.userData.id})
        .exec()
        .then(profiles => {
            // if profile doesn't exist
            if (profiles.length == 0) {
                let profile = new Profile({
                    user: req.userData.id,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    major: req.body.major,
                    sessionTime: req.body.sessionTime,
                })
                profile
                .save()
                .then( result => {
                    return res.status(200).json({
                        success: 'Profile Updated'
                    });
                })
                .catch(err => {
                    if (err.errors && err.errors.gender) {
                        return res.status(500).json({
                            fail: 'Wrong gender value provided'
                        });
                    }
                    return res.status(500).json({
                        fail: 'error',
                        error: err,
                    });
                })
            } else { // if profile exists
                let profile = profiles[0];
                profile.overwrite({
                    user: profile.user,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    major: req.body.major,
                    sessionTime: req.body.sessionTime,
                })
                .save()
                .then( profile => {
                    return res.status(200).json({
                    success: 'Profile Updated'
                    }); 
                })
                .catch(err => {
                    if (err.errors && err.errors.gender) {
                        return res.status(500).json({
                            fail: 'Wrong gender value provided'
                        });
                    }
                    return res.status(500).json({
                        fail: 'error',
                        error: err,
                    });
                });
            }
            
            
            
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        });
})

router.get('/', checkAuth, (req, res) => {
    Profile.find({user: req.userData.id})
        .exec()
        .then(profiles => {
            if (profiles.length == 0) {
                let profile = new Profile({
                    user: req.userData.id
                })
                profile
                .save()
                .then( result => {
                    return res.status(200).json({});
                })
                .catch(err => {
                    return res.status(500).json({
                        fail: 'error',
                        error: err,
                    });
                })
            } else {
                const profile = profiles[0];
                return res.status(200).json({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    gender: profile.gender,
                    major: profile.major,
                    sessionTime: profile.sessionTime,
                });
            }
            
        })
        .catch(err => {
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        });
})

router.get('/:userid', checkAuth, (req, res) => {
    User.findById(req.params.userid, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        }
        if (result == null) {
            return res.status(404).json({
                fail: "User doesn't exist"
            });
        }
        Profile.findOne({user: req.params.userid}, function(err, result) {
        console.log('result ' + result);
        if (err) {
            console.log(err);
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        }
        if (result == null) {
            return res.status(200).json({success: 'success'});
        }
        res.status(200).json({
            firstName: result.firstName,
            lastName: result.lastName,
            gender: result.gender,
            major: result.major,
            sessionTime: result.sessionTime,
        });
    });
    });
    
});

module.exports = router;