/* global io */

(function () {
    'use strict';

    const socket = io();
    let userid = null;
    console.log(socket);
    socket.on('userid', (data) => {
        userid = data;
        console.log(data);
        socket.emit('join-room', document.location.pathname);
    });
}());
