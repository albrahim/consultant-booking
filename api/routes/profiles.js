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
                    gender: req.body.gender,
                    major: req.body.major,
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
                    gender: req.body.gender,
                    major: req.body.major,
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
                return res.status(200).json({gender: profile.gender, major: profile.major});
            }
            
        })
        .catch(error => {
            return res.status(500).json({
                message: 'Error'
            });
        });
})

module.exports = router;