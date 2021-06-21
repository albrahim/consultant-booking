const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Profile = require('../models/profile');
const Booking = require('../models/booking');

const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, (req, res) => {
    let consultantId = req.body.consultantId;
    let traineeId = req.userData.id;
    let startTimeInput = req.body.startTime; // string or integer
    let endTimeInput = req.body.endTime;
    // validate all fields filled
    if (!consultantId || !traineeId || !startTimeInput || !endTimeInput) {
        return res.status(500).json({
            message: 'Invalid request'
        });
    }
    // convert from string or integer to date object
    let startTime = new Date(startTimeInput);
    let endTime = new Date(endTimeInput);
    // validate start time
    const currentTime = new Date();
    if (startTime.getTime() < currentTime.getTime()) {
        return res.status(500).json({
            message: 'Invalid start time'
        });
    }
    
    const booking = new Booking({
        consultant: consultantId,
        trainee: traineeId,
        startTime: startTime,
        endTime: endTime,
    });
    booking.save();
    return res.status(200).json({
        consultant: booking.consultant,
        trainee: booking.trainee,
        startTime: booking.startTime,
        endTime: booking.endTime,
    });
});

module.exports = router;