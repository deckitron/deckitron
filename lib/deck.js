'use strict';

const rooms = require('./rooms');
const cardSearch = require('./cardSearch');
const mongoose = require('mongoose');
const deckSchema = require('./models/deckSchema');
const cardSchema = require('./models/cardSchema');
const Deck = mongoose.model('Deck', deckSchema);
const Card = mongoose.model('Card', cardSchema);
const rMana = /[grbuw]/ig;

function exports (io, socket, room, user) {
    const roomData = rooms.getRoomDetails(room);

    roomData.on('closed', () => {
        if (roomData.deck.totalCardCount <= 0) {
            roomData.deck.remove();
        }
    });

    socket.on('cards.distincts.get', (request) => {
        console.log('GETTING DISTINCTS');
        Card.find({})
        .distinct(request.field)
        .exec((err, data) => {
            if (err) {
                console.error('Database error!');
                console.error(err);
                return;
            }
            socket.emit('cards.distincts.get.result', {
                field: request.field,
                result: data
            });
        });
    });

    socket.on('cards.get', (request) => {
        console.log('cards.get', request);
        const page = request
            ? request.page
            : null;
        const keywords = request
            ? request.keywords
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
        cardSearch.searchByKeyword(keywords, query, page, sort, (err, result) => {
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
                roomData.deck.totalCardCount += request.card.count;
                return roomData.deck.save();
            })
            .then(() => {
                console.log('Addded Card');
                io.to(room)
                    .emit('cards.deck.update', {
                        user: user,
                        msg: 'Card Added',
                        deck: roomData.deck,
                        list: request.list
                    });
                if (request.list === 'cards') {
                    updateDeckStats();
                }
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
                roomData.deck.totalCardCount -= count;
                return roomData.deck.save();
            })
            .then(() => {
                io.to(room)
                    .emit('cards.deck.update', {
                        user: user,
                        msg: 'Card Removed',
                        deck: roomData.deck,
                        list: request.list
                    });
                if (request.list === 'cards') {
                    updateDeckStats();
                }
            });
    });
    socket.on('cards.deck.getStats', () => {
        if (roomData.deckStats) {
            socket.emit('cards.deck.stats', roomData.deckStats);
        } else {
            updateDeckStats();
        }
    });

    function updateDeckStats () {
        const idMap = {};
        const cardIds = roomData.deck.cards.map((item) => {
            idMap[item.id] = item.count;
            return item.id;
        });
        console.log('updateDeckStats');
        Card.find({
            id: {
                $in: cardIds
            }
        })
        .exec((err, data) => {
            console.log(data);
            const stats = {
                affinity: {
                    R: 0,
                    B: 0,
                    U: 0,
                    W: 0,
                    G: 0
                },
                curve: [],
                types: {}
            };
            data.forEach((item) => {
                const cardCount = idMap[item.id];
                const mana = item.manaCost;
                let match;
                while (match = rMana.exec(mana)) {
                    stats.affinity[match[0]] += cardCount;
                }
                if (item.cmc != null) {
                    stats.curve[item.cmc] = stats.curve[item.cmc]
                        ? stats.curve[item.cmc] + cardCount
                        : cardCount;
                }
                item.types.forEach((type) => {
                    stats.types[type] = stats.types[type]
                        ? stats.types[type] + cardCount
                        : cardCount;
                });
            });
            roomData.deckStats = stats;
            io.to(room)
                .emit('cards.deck.stats', stats);
        });
    }

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
            updateDeckStats();
            socket.emit('cards.deck.current', roomData.deck);
        });
    } else {
        socket.emit('cards.deck.current', roomData.deck);
    }
}

module.exports = exports;
