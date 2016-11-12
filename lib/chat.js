'use strict';

function exports (io, socket, room, user) {
    socket.on('new message', (message) => {
        console.log(`user ${user.id} to room ${room}: ${message}`);
        io.to(room)
            .emit('message', {
                user: user,
                message: message
            });
    });
}

module.exports = exports;
