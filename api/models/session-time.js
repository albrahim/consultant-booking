const mongoose = require('mongoose');

const sessionTimeSchema = mongoose.Schema({
    acceptableDays: {
        type: [String],
        enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        default: ['sun', 'mon', 'tue', 'wed', 'thu']
    },
    acceptableHours: [mongoose.Schema({
        startHour: Number,
        startMinute: Number,
        endHour: Number,
        endMinute: Number
    }, {_id: false})],
    maximumMinutesPerSession: Number,
}, {_id: false});

/*
{
    acceptableHours: [
        {startHour: , startMinute: , endHour: , endMinute: },
        {startHour: , startMinute: , endHour: , endMinute: },
    ]
}
*/

module.exports = {
    schema: sessionTimeSchema,
    model: mongoose.model('SessionTime', sessionTimeSchema),
}