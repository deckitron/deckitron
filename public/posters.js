/* global angular */
(function () {
    'use strict';

    const posterwall = angular.module('posterwall', ['room', 'ngMaterial']);


    posterwall.controller('posterwall', ['$scope', '$rootScope', 'room', '$mdDialog', '$timeout', function ($scope, $rootScope, $room, $mdDialog, $timeout) {
        $scope.permitBigLoad = false;
        function gotCards (data) {
            $timeout(() => {
                if ($scope.askForBigLoad()) {
                    $rootScope.$broadcast('block-paged-load');
                    return;
                }
                if (Array.isArray(data.result)) {
                    $scope.cards = $scope.cards.concat(data.result);
                    // console.log(data);
                }
            });
        }

        const socket = $room.getSocket();
        socket.on('cards.get.result', gotCards);
        $scope.cards = [];

        $scope.allowBigLoad = function () {
            $scope.permitBigLoad = true;
        };

        $scope.$on('clear-card-wall', function () {
            $scope.cards = [];
        });

        $scope.askForBigLoad = function () {
            return $scope.cards.length >= 350 && !$scope.permitBigLoad;
        };

        $scope.getCardBackURL = function () {
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card';
        };
    }]);
}());
