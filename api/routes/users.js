const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/s/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    // res.status(200);
    // return
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
    });

    user
    .save()
    .then(result => {
        return res.status(200).json({
            message: 'Created',
            user: {
                email: email,
                password: password,
                result: result
            }
        });
    })
    .catch( error => {
        res.status(500).json(error);
    });

});

router.post('/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email})
    .exec()
    .then( users => {
        const user = users[0]
        if (password === req.body.password)
        return res.status(201).json({
            message: 'User login',
            user: {
                username: user.email,
                password: user.password,
            }
        });
    })
    .catch( result => {
        return res.status(500).json(result);
    });
});

module.exports = router;