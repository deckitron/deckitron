'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    id: String,
    name: String,
    names: [String],
    layout: String,
    manaCost: String,
    cmc: Number,
    colors: [String],
    colorIdentity: [String],
    type: String,
    supertypes: [String],
    types: [String],
    subtypes: [String],
    rarity: String,
    text: String,
    flavor: String,
    artist: String,
    number: String,
    power: String,
    toughness: String,
    loyalty: Number,
    multiverseid: Number,
    variations: [Number],
    imageName: String,
    watermark: String,
    border: String,
    timeshifted: Boolean,
    hand: Number,
    life: Number,
    reserved: Boolean,
    releaseDate: String,
    starter: Boolean,
    mciNumber: Number,
    rulings: [{
        date: String,
        text: String
    }],
    foreignNames: [{
        language: String,
        name: String,
        multiverseid: Number
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

module.exports = CardSchema;
