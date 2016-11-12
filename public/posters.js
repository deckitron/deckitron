/* global angular */
(function () {
    'use strict';

    const posterwall = angular.module('posterwall', ['room']);

    posterwall.controller('posterwall', ['$scope', 'room', function ($scope, $room) {
        $scope.cardSelected = function () {
            console.log('clicked');
        };
        $scope.cards = [];


        function gotCards (data) {
            if (Array.isArray(data)) {
                $scope.cards = data;
            }
        }

        const socket = $room.getSocket();
        socket.on('cards.get.result', gotCards);
        socket.on('cards.deck.update', console.log);
        window.sock = socket;
        $scope.getCardImageURL = function (id) {
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + id + '&type=card';
        };
    }]);
}());
