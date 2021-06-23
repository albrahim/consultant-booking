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
                        message: 'Profile Updated'
                    });
                })
                .catch(error => {
                    return res.status(500).json(error);
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
                    message: 'Profile Updated'
                    }); 
                })
                .catch(error => {
                    return res.status(500).json(error);
                })
            }
            
            
            
        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                message: 'Error'
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
                .catch(error => {
                    return res.status(500).json(error);
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
        .catch(error => {
            return res.status(500).json({
                message: 'Error'
            });
        });
})

router.get('/:userid', checkAuth, (req, res) => {
    User.findById(req.params.userid, function(error, result) {
        if (error) {
            console.log(error);
            return res.status(500).json({error: error});
        }
        if (result == null) {
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }
    });
    Profile.findOne({user: req.params.userid}, function(error, result) {
        console.log('result ' + result);
        if (error) {
            console.log(error);
            return res.status(500).json({error: error});
        }
        if (result == null) {
            return res.status(200).json({});
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

module.exports = router;