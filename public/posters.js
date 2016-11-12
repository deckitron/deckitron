/* global angular */
(function () {
    'use strict';

    const posterwall = angular.module('posterwall', []);

    posterwall.controller('posterwall', ['$scope', function ($scope) {
        $scope.cardSelected = function () {
            console.log('clicked');
        };

        $scope.cards = [
            {
                imageID: 208253
            },
            {
                imageID: 208253
            },
            {
                imageID: 208253
            },
            {
                imageID: 208253
            },
            {
                imageID: 208253
            },
            {
                imageID: 208253
            },
            {
                imageID: 208253
            },
            {
                imageID: 208253
            }
        ];

        $scope.getCardImageURL = function (id) {
            return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + id + '&type=card';
        };
    }]);
}());
