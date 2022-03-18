const mongoose = require('../config/database');

const wordSchema = new mongoose.Schema({
    word: {
        type: String
    },
    day: {
        type: Number
    }
})

module.exports = mongoose.model('wordCollection', wordSchema);