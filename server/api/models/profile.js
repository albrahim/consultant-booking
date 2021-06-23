const mongoose = require('mongoose');
const sessionTimeSchema = require('./session-time').schema;

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
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