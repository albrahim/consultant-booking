const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Profile = require('../models/profile');
const Booking = require('../models/booking');

const checkAuth = require('../middleware/check-auth');


router.put('/', checkAuth, async (req, res) => {
    if (req.body.sessionTime) { // validate consultant
        if (!req.body.firstName || !req.body.lastName || !req.body.gender || !req.body.major) {
            return res.status(500).json({
                fail: 'Missing profile fields for consultant'
            });
        }
    }

    if (req.body.sessionTime) { // validate session time
        const sessionTime = req.body.sessionTime;
        if (sessionTime.acceptableHours) { // validate acceptable hours
            if (sessionTime.acceptableHours.some(e => ![0, 30].includes(e.startMinute) || ![0, 30].includes(e.endMinute))) {
                return res.status(500).json({
                    fail: 'Invalid start or end minute'
                });
            }
        }
        if (sessionTime.minutesPerSession) { // validate minutes per session
            if (![30, 60].includes(sessionTime.minutesPerSession)) {
                return res.status(500).json({
                    fail: 'Invalid minutes per session'
                });
            }
        }
    }

    if (req.body.gender && !['male', 'female'].includes(req.body.gender)) {
        return res.status(500).json({
            fail: 'Wrong gender value provided'
        });
    }

    // if user has upcoming sessions
    Booking.find({
        $or: [
            { consultant: req.userData.id },
            { trainee: req.userData.id }
        ],
        startTime: {
            $gte: new Date()
        }
    }, async function(err, docs) {
        if (err) {
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        }
        console.log(docs);
        if (docs.length > 0 && !req.body.sessionTime) {
            return res.status(500).json({
                fail: 'Need to cancel bookings before removing profile fields',
            });
        }

        // change profile
        User.findById(req.userData.id, function(err, doc) {
            if (err) {
                return res.status(500).json({fail: 'error', error: err});
            }
            const profile = doc.profile;
            console.log(profile);

            profile.overwrite({
                user: profile.user,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                major: req.body.major,
                sessionTime: req.body.sessionTime,
            })
            .save( function(err) {
                if (err) {
                    return res.status(500).json({
                        fail: 'error',
                        error: err,
                    });
                }

                return res.status(200).json({
                    success: 'Profile Updated'
                }); 
            });
        });
    });
});

router.get('/', checkAuth, (req, res) => {
    console.log('running profile get')
    User.findById(req.userData.id, function(err, doc) {
        if (err) {
            return res.status(500).json({fail: 'error', error: err});
        }
        const profile = doc.profile;
        return res.status(200).json({
            firstName: profile.firstName,
            lastName: profile.lastName,
            gender: profile.gender,
            major: profile.major,
            sessionTime: profile.sessionTime,
        });
    });
});

router.get('/:userid', checkAuth, (req, res) => {
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
            return res.status(404).json({
                fail: "User doesn't exist"
            });
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