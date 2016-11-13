'use strict';

const swearjar = require('swearjar');
const rooms = require('./rooms');
const mongoose = require('mongoose');
const cardSchema = require('./models/cardSchema');
const Card = mongoose.model('Card', cardSchema);

const shivanRaptor = '751783fcd12b9c29b9d6f08b6aaf0c78123762dc';

function exports (io, socket, room, user) {
    socket.on('chat.newmessage', (message) => {
        if (message === 'raptorize') {
            console.log(`user ${user.id} raptorizes room ${room}`);
            io.to(room)
                .emit('chat.raptorize');
            return;
        }
        console.log(`user ${user.id} to room ${room}: ${message}`);
        io.to(room)
            .emit('chat.message', {
                user: user,
                message: swearjar.censor(message)
            });
    });
    socket.on('chat.sharecard', (cardID) => {
        if (cardID === shivanRaptor) {
            console.log(`user ${user.id} raptorizes everyone`);
            io.emit('chat.raptorize');
            // return;
        }
        console.log(`user ${user.id} to room ${room}: ${cardID}`);
        Card.findOne({
            id: cardID
        })
        .exec()
        .then((card) => {
            io.to(room)
                .emit('chat.card', {
                    user: user,
                    card: card
                });
        });
    });
    socket.on('chat.user.update', (newUser) => {
        if (user.id !== newUser.id) {
            return;
        }

        console.log(`user ${user.id} changed name from ${user.name} to ${newUser.name}`);
        user.name = newUser.name;
        io.to(room)
            .emit('chat.user.updated', user);
    });
    rooms.addUserToRoom(room, user);
    socket.on('chat.connect', () => {
        socket.emit('chat.connected', rooms.getRoomDetails(room));
        socket.broadcast.to(room)
            .emit('chat.user.connected', user);
    });

    socket.on('disconnect', () => {
        rooms.removeUserFromRoom(room, user);
        socket.broadcast.to(room)
            .emit('chat.user.disconnected', user);
    });
}

module.exports = exports;
