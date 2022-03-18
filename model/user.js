const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    gameStatus: {
        type: String,
    },
    completed: {
        type: Boolean,
    },
    attempt: {
        type: Number,
    },
    score: {
        type: Number,
    },
    wordArray: [],
    gameOver: {},
    currAttempt: {}

});

module.exports = mongoose.model('user', userSchema);
