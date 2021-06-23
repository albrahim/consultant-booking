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
            id: user._id,
            signupAt: user.signupAt,
            lastLoginAt: user.lastLoginAt,
        });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).json({
            error: error
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
                message: "Invalid email"
            })
        }
        updatedFields.email = req.body.email.toLowerCase();
    }
    
    // update password
    if (req.body.password === "") {
        return res.status(500).json({
            message: "Password cannot be empty"
        });
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
        console.log('bycrypt hash: ' + hash);
        updatedFields.hash = hash;
    }
    User.findByIdAndUpdate(req.userData.id, updatedFields, function(error, result) {
        if (error) {
            console.log(error);
            if (error.codeName === "DuplicateKey") {
                return res.status(500).json({error: "Email already in use by another user"})
            }
            return res.status(500).json({error: error});
        }
        return res.status(200).json({
            message: "Updated successfully",
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