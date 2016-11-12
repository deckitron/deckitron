'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    id: String,
    cards: [{
        id: String,
        count: Number
    }]
});

module.exports = DeckSchema;
