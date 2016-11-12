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
    socket.emit('chat.connected', rooms.getRoomDetails(room));
    socket.broadcast.to(room)
        .emit('chat.user.connected', user);

    socket.on('disconnect', () => {
        rooms.removeUserFromRoom(room, user);
        socket.broadcast.to(room)
            .emit('chat.user.disconnected', user);
    });
}

module.exports = exports;
