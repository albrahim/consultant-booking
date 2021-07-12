const mongoose = require('mongoose');
const sessionTimeSchema = require('./session-time').schema;

const profileSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    major: String,
    sessionTime: sessionTimeSchema,
})

module.exports = mongoose.model('Profile', profileSchema);