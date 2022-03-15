const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    gamePlayedAt: {
        type: Date,
    },
    gameStatus: {
        type: String,
        enum: ['Won', 'Lose'],
        // default: '',
    },

});

module.exports = mongoose.model('user', userSchema);
