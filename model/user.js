const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    day: {
        type: Number,
    },
    gameStatus: {
        type: Boolean,
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
    word: {
        type: String,
    }

});

module.exports = mongoose.model('user', userSchema);
