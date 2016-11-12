'use strict';

// We need this to build our post string
const querystring = require('querystring');
const http = require('http');
const fs = require('fs');

let totalCards = 0;
let cardCount = 0;

function postData (jsonData, callback) {
    const options = {
        host: 'localhost',
        port: '5000',
        path: '/rest/1.0/cardData',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonData)
        }
    };
    const request = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(chunk);
        });
        res.on('end', () => {
            callback();
        });
    });
    request.write(jsonData);
    request.end();
}

function next(cards, i) {
    cardCount++;
    console.log(`Processed ${cardCount}/${totalCards} (${(cardCount / totalCards) * 100}%) cards`);
    if (i + 1 >= cards.length) {
        console.log('Set ingest complete');
        return;
    }
    postData(JSON.stringify(cards[i]), next.bind(null, cards, i + 1));
}

fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const jsonData = JSON.parse(data);
    const keys = Reflect.ownKeys(jsonData);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const set = jsonData[key];
        const cards = set.cards;
        totalCards += cards.length;
        postData(JSON.stringify(cards[0]), next.bind(null, cards, 1));
    }
});
