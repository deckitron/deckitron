#!/usr/bin/env node
'use strict';

const DATA_SOURCE = 'https://mtgjson.com/json/AllSets-x.json.zip';

const mongoose = require('mongoose');
const cardSchema = require('../lib/models/cardSchema');
const setSchema = require('../lib/models/setSchema');

const https = require('https');
const unzip = require('unzip');
const url = require('url');

const Card = mongoose.model('Card', cardSchema);
const Set = mongoose.model('Set', setSchema);

/**
 * Get the compressed JSON data from the server.
 *
 * @param {String} url The URL to fetch from.
 * @param {Function} callback The function to call once the operation is
 * complete.
 *
 * @throws {Error} If the callback is invalid.
 */
function getFromServer (uri, callback) {
    let errored = false;
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback');
    }
    const parsedUrl = url.parse(uri);
    const request = https.request({
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'GET'
    }, (response) => {
        if (!errored) {
            callback(null, response);
            return;
        }
    });
    request.on('error', (err) => {
        errored = true;
        callback(err, null);
    });
    request.end();
}

function sendNextCard (cards, set, i, callback) {
    if (i >= cards.length) {
        console.log(`All cards for set ${set.name} processed`);
        callback();
        return;
    }
    // console.log(`Uploading card ${i + 1}/${cards.length} for set ${set.name}...`);
    Card.find({id: cards[i].id}).exec((err, data) => {
        if (err) {
            console.error('Database error!');
            console.error(err);
            return;
        }
        if (data.length > 0) {
            // console.warn('Card exists, updating');
            Card.update({
                id: cards[i].id
            }, cards[i], (e) => {
                if (e) {
                    console.error('Database error!');
                    console.error(e);
                    return;
                }
                sendNextCard(cards, set, i + 1, callback);
            });
        } else {
            // console.log('Card does not exist, adding');
            Card.create(cards[i], (e) => {
                if (e) {
                    console.error('Database error!');
                    console.error(e);
                    return;
                }
                sendNextCard(cards, set, i + 1, callback);
            });
        }
    });
}

function sendNextSet (sets, i, callback) {
    const keys = Object.keys(sets);
    if (i >= keys.length) {
        console.log('All set data uploaded to database');
        callback();
        return;
    }
    const set = sets[keys[i]];
    const cards = set.cards;
    console.log(`Processing set '${set.name}' with ${cards.length} cards...`);
    set.cards = [];
    for (let n = 0; n < cards.length; n++) {
        set.cards.push(cards[n].id);
    }
    console.log('Remapped set card array into card ID array');
    console.log('Pushing card data to database...');
    sendNextCard(cards, set, 0, () => {
        console.log('Pushing set data to database...');
        Set.find({
            code: set.code
        })
        .exec((err, data) => {
            if (err) {
                console.error('Database error!');
                console.error(err);
                return;
            }
            if (data.length > 0) {
                console.warn('Set exists, updating database');
                Set.update({
                    id: set.id
                }, set, (e) => {
                    if (e) {
                        console.error('Database error!');
                        console.error(e);
                        return;
                    }
                    sendNextSet(sets, i + 1, callback);
                });
            } else {
                console.log('Creating set');
                Set.create(set, (e) => {
                    if (e) {
                        console.error('Database error!');
                        console.error(e);
                        return;
                    }
                    sendNextSet(sets, i + 1, callback);
                });
            }
        });
    });
}

function processData (jsonString) {
    const jsonData = JSON.parse(jsonString);
    sendNextSet(jsonData, 0, () => {
        console.log('Ingest completed');
    });
}

let db = 'mongodb://localhost/deckitron';

if (process.argv.length > 2) {
    db = process.argv[2];
}

mongoose.connect(db, (err) => {
    if (err) {
        console.error('Failed to open MongoDB connection!');
        return;
    }
    console.log('Connected to database, fetching JSON data...');
    getFromServer(DATA_SOURCE, (err, stream) => {
        let serverData = '';
        if (err) {
            console.error('Failed to fetch JSON data!');
            console.error(err);
            return;
        }
        stream.pipe(unzip.Parse())
        .on('entry', (entry) => {
            const filename = entry.path;
            const type = entry.type;
            const size = entry.size;
            console.log(`Processing ${filename} from archive...`);
            if (filename.endsWith('.json')) {
                entry.on('data', (chunk) => {
                    if (typeof chunk === 'string') {
                        serverData += chunk;
                    } else {
                        serverData += chunk.toString('utf8');
                    }
                });
                entry.on('end', () => {
                    console.log('Data loaded, processing...');
                    processData(serverData);
                });
            } else {
                entry.autodrain();
            }
        })
    });
});
