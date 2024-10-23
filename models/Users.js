const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({

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
    }
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model('User', userSchema);