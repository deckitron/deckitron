/* global io, chat */

(function () {
    'use strict';

    const socket = io();

    socket.on('connected', (data) => {
        socket.user = data;
        socket.roomId = document.location.pathname.substr(1);
        console.log('userid', data.id);
        socket.emit('join-room', socket.roomId);
        chat(socket);
    });

    window.socket = socket;
}());
