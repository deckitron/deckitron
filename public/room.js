/* global angular, io */

(function () {
    'use strict';

    const room = angular.module('room', []);
    const socket = io();
    let deck = {};

    room.service('room', [function () {
        return {
            getSocket: () => {
                return socket;
            },
            getUser: () => {
                return socket.user;
            },
            getDeck: () => {
                return deck;
            }
        };
    }]);

    socket.on('connected', (data) => {
        socket.user = data;
        socket.emit('room.join', document.location.pathname.substr(1));
    });

    socket.on('cards.deck.update', (data) => {
        deck = data.deck;
        console.log('cards.deck.update', data);
    });

    socket.on('cards.deck.current', (data) => {
        deck = data;
        console.log('cards.deck.current', data);
    });
}());
