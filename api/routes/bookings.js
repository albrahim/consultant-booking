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
    if (startTime.getTime() >= endTime.getTime()) {
        return res.status(500).json({
            message: 'Invalid start time and end time'
        });
    }
    // check if profile exists
    Profile.find({user: consultantId}, function(err, docs) {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        if (docs.length < 1) {
            return res.status(500).json({
                message: 'This user is not a consultant'
            });
        }
        const profile = docs[0]
        if (!profile.sessionTime) {
            return res.status(500).json({
                message: 'This user is not a consultant'
            });
        }
        // profile exists

        // check if booking time is valid for this consultant
        const acceptableHours = profile.sessionTime.acceptableHours;
        const isAcceptableBookingTime = acceptableHours.some( e => {
            const validStartHour = startTime.getHours() >= e.startHour && startTime.getHours() < e.endHour;
            const validStartMinute = (startTime.getHours() == e.startHour) ? (startTime.getMinutes() >= e.startMinute) : (true);
            const validEndHour = endTime.getHours() <= e.endHour;
            const validEndMinute = (endTime.getHours() == e.endHour) ? (endTime.getMinutes() <= e.endMinute) : (true);
            return (validStartHour && validStartMinute && validEndHour && validEndMinute)
        });
        const acceptableDays = profile.sessionTime.acceptableDays;
        const dayNumberMapping = {
            0: 'sun', 1: 'mon', 2: 'tue', 3: 'thu', 4: 'wed', 5: 'thu', 6: 'fri'
        }

        const isAcceptableBookingDay = acceptableDays.some(e => dayNumberMapping[startTime.getDay()] === e)
        if (!isAcceptableBookingTime || !isAcceptableBookingDay) {
            return res.status(500).json({
                message: "Invalid booking time for this consultant"
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
    })
});

module.exports = router;