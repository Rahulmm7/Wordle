const mongoose = require('../config/database');

const wordSchema = new mongoose.Schema({
    word: {
        type: String
    },
    date: {
        type: String
    }
})

module.exports = mongoose.model('wordCollection', wordSchema);