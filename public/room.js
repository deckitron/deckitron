/* global angular, io */

(function () {
    'use strict';

    const room = angular.module('room', []);
    const socket = io();
    window.socket = socket;

    room.service('room', [function () {
        return {
            getSocket: () => {
                return socket;
            },
            getUser: () => {
                return socket.user;
            },
            getDeck: () => {
                return socket.deck;
            }
        };
    }]);

    socket.on('connected', (data) => {
        socket.user = data;
        socket.emit('room.join', document.location.pathname.substr(1));
    });

    socket.on('cards.deck.update', (data) => {
        socket.deck = data.deck;
        // console.log('cards.deck.update', data);
    });

    socket.on('cards.deck.current', (data) => {
        socket.deck = data;
        socket.emit('cards.deck.getStats');
        // console.log('cards.deck.current', data);
    });
}());
