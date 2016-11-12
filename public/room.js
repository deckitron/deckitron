/* global io */

(function () {
    'use strict';

    const socket = io();
    let userid = null;

    socket.on('connected', (data) => {
        userid = data.userid;
        console.log('userid', data);
        socket.emit('join-room', document.location.pathname.substr(1));
    });
}());
