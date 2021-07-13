const mongoose = require('mongoose');
const sessionTimeSchema = require('./session-time').schema;

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    major: String,
    sessionTime: sessionTimeSchema,
})

module.exports = mongoose.model('Profile', profileSchema);