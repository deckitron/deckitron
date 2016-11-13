/* global angular */
(function () {
    'use strict';

    const posterwall = angular.module('posterwall', ['room', 'ngMaterial']);


    posterwall.controller('posterwall', ['$scope', 'room', '$mdDialog', '$timeout', function ($scope, $room, $mdDialog, $timeout) {
        $scope.permitBigLoad = false;
        function gotCards (data) {
            $timeout(() => {
                if ($scope.askForBigLoad()) {
                    // HACK Since $emit only works up/down, not side-to-side
                    const e = new Event('block-paged-load', {
                        cancelable: true
                    });
                    window.dispatchEvent(e);
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

        $scope.allowBigLoad = function () {
            $scope.permitBigLoad = true;
        };

        $scope.askForBigLoad = function () {
            return $scope.cards.length >= 350 && !$scope.permitBigLoad;
        };

        $scope.getCardBackURL = function () {
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card';
        };
    }]);
}());
