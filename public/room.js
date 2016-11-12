/* global angular, io */

(function () {
    'use strict';

    const room = angular.module('room', []);
    const socket = io();

    room.service('room', [function () {
        return {
            getSocket: () => {
                return socket;
            },
            getUser: () => {
                return socket.user;
            }
        };
    }]);

    socket.on('connected', (data) => {
        socket.user = data;
        socket.emit('room.join', document.location.pathname.substr(1));
    });
}());
