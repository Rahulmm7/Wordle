const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    gameStatus: {
        type: Boolean,
    },
    completed: {
        type: Boolean,
    },
    word: {
        type: String,
    }

});

module.exports = mongoose.model('user', userSchema);
