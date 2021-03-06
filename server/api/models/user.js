const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    hash: {
        type: String,
        required: true,
    },
    signupAt: Date,
    lastLoginAt: Date,
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: false,
        autopopulate: true,
    }
});

userSchema.plugin(require('mongoose-autopopulate'));

userSchema.pre('remove', function(next) {
    console.log('will remove user');
    this.model('Profile').findOneAndRemove({user: this._id}).exec().catch(error => {});
    next();
});

module.exports = mongoose.model('User', userSchema);