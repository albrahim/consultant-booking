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
            fail: 'Invalid request'
        });
    }
    // convert from string or integer to date object
    let startTime = new Date(startTimeInput);
    let endTime = new Date(endTimeInput);
    // validate start time
    const currentTime = new Date();
    if (startTime.getTime() < currentTime.getTime()) {
        return res.status(500).json({
            fail: 'Invalid start time'
        });
    }
    if (startTime.getTime() >= endTime.getTime()) {
        return res.status(500).json({
            fail: 'Invalid start time and end time'
        });
    }
    // check if profile exists
    Profile.find({user: consultantId}, function(err, docs) {
        if (err) {
            return res.status(500).json({
                fail: 'error',
                error: err,
            });
        }
        if (docs.length < 1) {
            return res.status(500).json({
                fail: 'Invalid user id'
            });
        }
        const profile = docs[0]
        if (!profile.sessionTime) {
            return res.status(500).json({
                fail: 'This user is not a consultant'
            });
        }
        // profile exists

        // check if booking time is valid for this consultant
        const acceptableHours = profile.sessionTime.acceptableHours;
        const isAcceptableBookingTime = acceptableHours.some( e => {
            const validStartHour = (startTime.getDay() == endTime.getDay()) ? (startTime.getHours() >= e.startHour && startTime.getHours() < e.endHour) : (e.endHour < e.startHour);
            console.log('validStartHour: ' + validStartHour);
            const validStartMinute = (startTime.getHours() == e.startHour) ? (startTime.getMinutes() >= e.startMinute) : (true);
            console.log('validStartMinute: ' + validStartMinute);
            const validEndHour = (startTime.getDay() == endTime.getDay()) ? (endTime.getHours() <= e.endHour) : (e.endHour < e.startHour);
            console.log('validEndHour: ' + validEndHour);
            const validEndMinute = (endTime.getHours() == e.endHour) ? (endTime.getMinutes() <= e.endMinute) : (true);
            console.log('validEndMinute: ' + validEndMinute);
            return (validStartHour && validStartMinute && validEndHour && validEndMinute)
        });
        const acceptableDays = profile.sessionTime.acceptableDays;
        const dayNumberMapping = {
            0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'
        }

        const isAcceptableBookingDay = acceptableDays.some(e => dayNumberMapping[startTime.getDay()] === e)
        if (!isAcceptableBookingTime || !isAcceptableBookingDay) {
            return res.status(500).json({
                fail: "Invalid booking time for this consultant"
            });
        }

        const maximumMinutesPerSession = profile.sessionTime.maximumMinutesPerSession;
        if (maximumMinutesPerSession) {
            const sessionDurationInMinutes = (endTime.getTime() - startTime.getTime()) / (60 * 1000);
            console.log('sessionDurationInMinutes: ' + sessionDurationInMinutes);
            if (sessionDurationInMinutes > maximumMinutesPerSession) {
                return res.status(500).json({
                    fail: 'Invalid session duration for this consultant'
                });
            }
        }

        Booking.find({
            consultant: consultantId,
        }, function(err, docs) {
            if (err) {
                return res.status(500).json({
                    fail: 'error',
                    error: err,
                });
            }
            console.log(docs);
            const thereIsConflictWithOtherSessionsForThisConsultant = docs.some(e => startTime.getTime() <= e.endTime.getTime() && endTime.getTime() >= e.startTime.getTime());
            if (thereIsConflictWithOtherSessionsForThisConsultant) {
                return res.status(500).json({
                    fail: 'Conflict with another consultant session'
                });
            }

            Booking.find({
                trainee: traineeId,
            }, function(err, docs) {
                if (err) {
                    return res.status(500).json({
                        fail: 'error',
                        error: err,
                    });
                }
                const thereIsConflictWithOtherSessionsForThisTrainee = docs.some(e => startTime.getTime() <= e.endTime.getTime() && endTime.getTime() >= e.startTime.getTime());
                if (thereIsConflictWithOtherSessionsForThisTrainee) {
                    return res.status(500).json({
                        fail: 'Conflict with another trainee session'
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
                    success: 'Booking successful',
                    id: booking._id,
                    consultant: booking.consultant,
                    trainee: booking.trainee,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                });
            });
        });
    });
});

router.get('/reservations', checkAuth, (req, res) => {
    let userId = req.userData.id;
    Booking.find({ trainee: userId }, function(err, asTraineeDocs) {
        if (err) {
            res.status(500).json({ fail: 'error', error: err });
        }
        Booking.find({ consultant: userId }, function(err, asConsultantDocs) {
            if (err) {
                res.status(500).json({ fail: 'error', error: err });
            }
            let asConsultantArray = asConsultantDocs.map(e => ({
                id: e._id,
                consultant: e.consultant,
                trainee: e.trainee,
                startTime: e.startTime,
                endTime: e.endTime,
            }));
            let asTraineeArray = asTraineeDocs.map(e => ({
                id: e._id,
                consultant: e.consultant,
                trainee: e.trainee,
                startTime: e.startTime,
                endTime: e.endTime,
            }));
            res.status(200).json({
                asConsultant: asConsultantArray,
                asTrainee: asTraineeArray,
            });
        });
    });
});

router.get('/reservations/:reservationId', checkAuth, (req, res) => {
    let userId = req.userData.id;
    Booking.findOne({
        _id: req.params.reservationId,
        $or: [{consultant: userId}, {trainee: userId,}], // User can see reservation only if
    }, function(err, doc) { //                              he is related to it.
        if (err) {
            console.log(err);
            if (err.kind == "ObjectId" && err.name == "CastError") {
                return res.status(500).json({ fail: 'Wrong id' })
            }
            return res.status(500).json({ fail: 'error', error: err });
        }
        console.log(doc);
        if (doc == null) {
            return res.status(500).json({ fail: 'Reservation not found' });
        }
        return res.status(200).json({
            id: doc._id,
            consultant: doc.consultant,
            trainee: doc.trainee,
            startTime: doc.startTime,
            endTime: doc.endTime,
        });
    });
});

router.delete('/reservations/:reservationId', checkAuth, (req, res) => {
    let userId = req.userData.id;
    Booking.findOne({
        _id: req.params.reservationId,
        $or: [{consultant: userId}, {trainee: userId,}], // User can cancel reservation only if
    }, function(err, doc) { //                              he is related to it.
        if (err) {
            console.log(err);
            if (err.kind == "ObjectId" && err.name == "CastError") {
                return res.status(500).json({ fail: 'Wrong id' })
            }
            return res.status(500).json({ fail: 'error', error: err });
        }
        console.log(doc);
        if (doc == null) {
            return res.status(500).json({ fail: 'Reservation not found' });
        }
        doc.delete(function(err) {
            if (err) {
                return res.status(500).json({ fail: 'error', error: err });
            }
            return res.status(200).json({ success: 'Canceled successfully'})
        });
    });
});

module.exports = router;