'use strict';

const rooms = require('./rooms');
const cardSearch = require('./cardSearch');
const mongoose = require('mongoose');
const deckSchema = require('./models/deckSchema');
const Deck = mongoose.model('Deck', deckSchema);

function exports (io, socket, room, user) {
    const roomData = rooms.getRoomDetails(room);

    roomData.on('closed', () => {
        if (roomData.deck.totalCardCount <= 0) {
            roomData.deck.remove();
        }
    });

    socket.on('cards.get', (request) => {
        console.log('cards.get', request);
        const page = request
            ? request.page
            : null;
        const query = request
            ? request.query || {}
            : {};
        const sort = request
            ? request.sort
            : null;
        const list = request
            ? roomData.deck[request.list]
            : null;
        if (list) {
            const cardIds = [];
            for (let i = 0; i < list.length; i += 1) {
                cardIds.push(list[i].id);
            }
            query.id = {
                $in: cardIds
            };
        }
        cardSearch.searchCards(query, page, sort, (err, result) => {
            console.log(err);
            // console.log(result);
            socket.emit('cards.get.result', {
                result: result,
                page: {
                    offset: page
                        ? page.offset
                        : 0,
                    count: result.length
                },
                list: list
                    ? request.list
                    : 'all'
            });
        });
    });

    // add card to deck list
    socket.on('cards.deck.add', (request) => {
        console.log('cards.deck.add', request);
        // do work to add card to list
        const list = roomData.deck[request.list] || roomData.deck.cards;
        request.card.count = typeof request.card.count === 'number'
            ? Math.max(1, request.card.count)
            : 1;
        let newCard = true;
        for (let i = 0; i < list.length; i += 1) {
            if (list[i].id === request.card.id) {
                list[i].count += request.card.count;
                newCard = false;
                break;
            }
        }
        if (newCard) {
            list.push(request.card);
        }
        roomData.deck.save()
            .then(() => {
                roomData.deck.totalCardCount++;
                return roomData.deck.save();
            })
            .then(() => {
                console.log('Addded Card');
                io.to(room)
                    .emit('cards.deck.update', {
                        user: user,
                        msg: 'Card Added',
                        deck: roomData.deck
                    });
            }, (err) => {
                console.log(err);
            });
    });
    // remove card from deck list
    socket.on('cards.deck.remove', (request) => {
        console.log('cards.deck.remove', request);
        // do work to remove cards from list
        const list = roomData.deck[request.list] || 'cards';
        const count = typeof request.card.count === 'number'
            ? Math.max(1, request.card.count)
            : 1;
        for (let i = 0; i < list.length; i += 1) {
            if (list[i].id === request.card.id) {
                list[i].count -= count;
                if (list[i].count <= 0) {
                    list.splice(i, 1);
                }
                break;
            }
        }
        roomData.deck.save()
            .then(() => {
                roomData.deck.totalCardCount--;
                return roomData.deck.save();
            })
            .then(() => {
                io.to(room)
                    .emit('cards.deck.update', {
                        user: user,
                        msg: 'Card Removed',
                        deck: roomData.deck
                    });
            });
    });

    if (!roomData.deck) {
        roomData.deck = {};
        Deck.find({
            id: room
        })
        .then((result) => {
            // console.log(result);
            if (result.length) {
                return result[0];
            }
            return Deck.create({
                id: room,
                totalCardCount: 0
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
