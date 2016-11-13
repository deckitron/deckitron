/* global angular */
(function () {
    'use strict';

    const posterwall = angular.module('posterwall', ['room', 'ngMaterial']);


    posterwall.controller('posterwall', ['$scope', 'room', '$mdDialog', '$timeout', function ($scope, $room, $mdDialog, $timeout) {
        function gotCards (data) {
            $timeout(() => {
                if ($scope.cards.length >= 500) {
                    return;
                }
                if (Array.isArray(data.result)) {
                    $scope.cards = $scope.cards.concat(data.result);
                    console.log(data);
                }
            });
        }

        const socket = $room.getSocket();
        socket.on('cards.get.result', gotCards);
        $scope.cards = [];

        $scope.getCardBackURL = function () {
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card';
        };
    }]);
}());
