/* global angular */
(function () {
    'use strict';

    const posterwall = angular.module('posterwall', ['room', 'ngMaterial']);

    posterwall.controller('posterwall', ['$scope', 'room', '$mdDialog', '$timeout', function ($scope, $room, $mdDialog, $timeout) {
        function DialogController ($scope, card) {
            $scope.card = card;
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.hide();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

        $scope.cardSelected = function (ev, card) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'public/cardinfo.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals: {
                    card: card
                }
            })
                .then((answer) => {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, () => {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.cards = [];


        function gotCards (data) {
            $timeout(() => {
                if (Array.isArray(data)) {
                    $scope.cards = data;
                }
            });
        }

        const socket = $room.getSocket();
        socket.on('cards.get.result', gotCards);
        $scope.getCardImageURL = function (id) {
            let normalizedID = id;
            if (!normalizedID) {
                normalizedID = 0;
            }
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + normalizedID + '&type=card';
        };

        $scope.getCardBackURL = function () {
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card';
        };
    }]);
}());
