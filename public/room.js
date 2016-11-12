/* global io */

(function () {
    'use strict';

    const socket = io();

    socket.on('connected', (data) => {
        socket.userid = data.userid;
        console.log('userid', data);
        socket.emit('join-room', document.location.pathname.substr(1));
    });

    window.socket = socket;
}());
