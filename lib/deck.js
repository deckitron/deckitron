'use strict';

const rooms = require('./rooms');
const cardSearch = require('./cardSearch');
const mongoose = require('mongoose');
const deckSchema = require('./models/deckSchema');
const Deck = mongoose.model('Deck', deckSchema);

function exports (io, socket, room, user) {
    const roomData = rooms.getRoomDetails(room);

    socket.on('cards.get', (query) => {
        console.log('cards.get', query);
        cardSearch.searchCards(query || {}, null, (err, result) => {
            console.log(err);
            socket.emit('cards.get.result', result);
        });
    });

    if (!roomData.deck) {
        roomData.deck = {};
        Deck.find({
            id: room
        })
        .then((result) => {
            console.log(result);
            if (result.length) {
                return result[0];
            }
            return Deck.create({
                id: room
            });
        })
        .then((result) => {
            roomData.deck = result;
            socket.emit('cards.deck.current', roomData.deck);
        });
    } else {
        socket.emit('cards.deck.current', roomData.deck);
    }
}

module.exports = exports;
