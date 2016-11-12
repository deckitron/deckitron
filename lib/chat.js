'use strict';

const rooms = require('./rooms');

function exports (io, socket, room, user) {
    socket.on('chat.newmessage', (message) => {
        console.log(`user ${user.id} to room ${room}: ${message}`);
        io.to(room)
            .emit('chat.message', {
                user: user,
                message: message
            });
    });
    rooms.addUserToRoom(room, user);
    socket.emit('chat.connected', rooms.getRoomDetails(room));
    socket.broadcast.to(room)
        .emit('chat.user.connected', user);

    socket.on('disconnected', () => {
        rooms.removeUserFromRoom(room, user);
        socket.broadcast.to(room)
            .emit('chat.user.disconnected', user);
    });
}

module.exports = exports;
