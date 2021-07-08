const mongoose = require('mongoose');

const sessionTimeSchema = mongoose.Schema({
    acceptableDays: {
        type: [String],
        enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        default: ['sun', 'mon', 'tue', 'wed', 'thu']
    },
    acceptableHours: [mongoose.Schema({
        startHour: {type: Number, required: true},
        startMinute: {type: Number, required: true},
        endHour: {type: Number, required: true},
        endMinute: {type: Number, required: true}
    }, {_id: false})],
    minutesPerSession: {type: Number, required: true},
}, {_id: false});

module.exports = {
    schema: sessionTimeSchema,
    model: mongoose.model('SessionTime', sessionTimeSchema),
}