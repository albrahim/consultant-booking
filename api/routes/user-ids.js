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
        });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).json({
            error: error
        })
    });
});

router.patch('/', checkAuth, (req, res) => {
    console.log('patch request for id: ' + req.userData.id);
    User.findOne({_id: req.userData.id})
    .exec()
    .then(async user => {
        if (req.body.email) {
            console.log('provided email: ' + req.body.email.toLowerCase());
            user.email = req.body.email.toLowerCase();
        }
        if (req.body.password) {
            console.log('provided password: ' + req.body.password);
            const hash = await bcrypt.hash(req.body.password, 10);
            if (!hash) {
                console.log('bcrypt error');
                return res.status(500).json({
                    error: 'error'
                });
            }
            console.log('hash in bycrypt callback: ' + hash);
            user.password = hash;
        }
        console.log('hash after bycrypt callback ' + user.password);
        user.save()
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                error: error
            });
        });
        console.log('id patch request success')
        return res.status(200).json({
            
            message: "Login information updated"
        });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).json({
            error: error
        }); 
    });
});

router.delete('/', checkAuth, (req, res) => {
    User.findOne({_id: req.userData.id})
    .exec()
    .then(user => {
        user.remove();
        return res.status(200).json({
            message: 'Deleted successfully'
        });
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});
module.exports = router;