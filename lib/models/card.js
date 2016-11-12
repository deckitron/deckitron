'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    id: String,
    name: String,
    names: [String],
    layout: String,
    manaCost: String,
    combinedManaCost: Number,
    colors: [String],
    colorIdentity: [String],
    type: String,
    superTypes: [String],
    types: [String],
    subTypes: [String],
    rarity: String,
    text: String,
    flavor: String,
    artist: String,
    number: String,
    power: String,
    toughness: String,
    loyalty: Number,
    multiverseID: Number,
    variations: [Number],
    imageName: String,
    watermark: String,
    border: String,
    timeShifted: Boolean,
    handModifier: Number,
    life: Number,
    reserved: Boolean,
    releaseDate: String,
    starter: Boolean,
    mciNumber: Number,
    rulings: [{
        date: String,
        text: String
    }],
    printings: [String],
    originalText: String,
    originalType: String,
    legalities: [{
        format: String,
        legality: String
    }],
    source: String
});

module.exports = {
    CardSchema: CardSchema
};
