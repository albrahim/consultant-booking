const mongoose = require('mongoose');

const sessionTimeSchema = mongoose.Schema({
    acceptableHours: [mongoose.Schema({
        startHour: Number,
        startMinute: Number,
        endHour: Number,
        endMinute: Number
    })],
    acceptableDays: {
        type: [String],
        enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    }
})

module.exports = {
    schema: sessionTimeSchema,
    model: mongoose.model('SessionTime', sessionTimeSchema),
}