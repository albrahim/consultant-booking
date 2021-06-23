const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    consultant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('Booking', bookingSchema);