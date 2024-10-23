const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({

    verification_code: {
        type: Number,
        require: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }

});

module.exports = mongoose.model('Otp', otpSchema);