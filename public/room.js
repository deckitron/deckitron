/* global io, chat */

(function () {
    'use strict';

    const socket = io();

    socket.on('connected', (data) => {
        socket.user = data;
        console.log('userid', data.id);
        socket.emit('join-room', document.location.pathname.substr(1));
        chat(socket);
    });

    window.socket = socket;
}());
