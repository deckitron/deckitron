'use strict';
const deckSchema = require('./models/deckSchema');
const cardSearch = require('./cardSearch');

function exports (io, socket, room, user) {
    socket.on('get_cards', () => {
        cardSearch.searchCards({}, null, (err, result) => {
            console.log(err);
            socket.emit('card_list', result);
        });
    });
    deckSchema.find({id: room}, (err, result) => {
        console.log(err);
        console.log(result);
        socket.emit('current_deck', result);
    });
    /*
    deckSchema.find({
        id: room
    }, (err, deck) => {
        console.log(err);
        console.log(deck);
        if (deck.length) {
            io.to(user)
                .emit('current_deck', deck[0]);
        } else {
            io.to(user)
                .emit('current_deck', {});
        }
    });
    */
}

module.exports = exports;
