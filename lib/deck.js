'use strict';
const deckSchema = require('./models/deckSchema');

function exports (io, socket, room, user) {
    socket.on('current_deck', console.log);
    deckSchema.findById(room, (err, deck) => {
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
}

module.exports = exports;
