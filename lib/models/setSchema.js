'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema({
    name: String,
    code: String,
    gathererCode: String,
    magicCardsInfoCode: String,
    releaseDate: Date,
    border: String,
    type: String,
    block: String,
    onlineOnly: Boolean,
    booster: [String],
    cards: [String]
});

module.exports = SetSchema;
