const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UnverifiedUserSchema = mongoose.Schema({

    firstName: {
        type: String,
        require: true
    },

    lastName: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    verificatin_code: {
        type: Number,
        require: true
    },

    is_verified: {
        type: Boolean,
        require: false,
        default: false
    }
});

UnverifiedUserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
})


module.exports = mongoose.model('UnverifiedUser', UnverifiedUserSchema);