'use strict';

const rooms = require('./rooms');
const cardSearch = require('./cardSearch');
const mongoose = require('mongoose');
const deckSchema = require('./models/deckSchema');
const Deck = mongoose.model('Deck', deckSchema);

function exports (io, socket, room, user) {
    const roomData = rooms.getRoomDetails(room);

    socket.on('cards.get', (request) => {
        console.log('cards.get', request);
        const page = request
            ? request.page
            : null;
        const query = request
            ? request.query
            : {};
        cardSearch.searchCards(query, page, null, (err, result) => {
            console.log(err);
            socket.emit('cards.get.result', result);
        });
    });

    // add card to deck list
    socket.on('cards.deck.add', (request) => {
        console.log('cards.deck.add', request);
        // do work to add card to list
        io.to(room)
            .emit('cards.deck.update', {
                user: user,
                msg: 'Card Added',
                deck: roomData.deck
            });
    });
    // remove card from deck list
    socket.on('cards.deck.remove', (request) => {
        console.log('cards.deck.remove', request);
        // do work to remove cards from list
        io.to(room)
            .emit('cards.deck.update', {
                user: user,
                msg: 'Card Removed',
                deck: roomData.deck
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
