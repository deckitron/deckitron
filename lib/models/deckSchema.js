'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    id: String,
    totalCardCount: Number,
    cards: [{
        id: String,
        count: Number
    }],
    sideboard: [{
        id: String,
        count: Number
    }],
    linked: [{
        id: String,
        count: Number
    }]
});

module.exports = DeckSchema;
