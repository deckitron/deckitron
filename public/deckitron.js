/* global angular*/
(function () {
    'use strict';

    const app = angular.module(
        'deckitron',
        [
            'ngMaterial',
            'chat',
            'posterwall',
            'cardTypesController',
            'manaColorController',
            'filters',
            'deckStats'
        ]
    );

    app.config(($mdThemingProvider) => {
        $mdThemingProvider.theme('default')
            .primaryPalette('pink')
            .accentPalette('indigo')
            .dark();
    });

    app.controller('DeckitronCore', ['$scope', function ($scope) {
        $scope.title = 'Deckitron';

        $scope.convertedManaCost = ['1', '2', '3', '4', '5', '6'];
    }]);

    app.run(($log) => {
        $log.debug('Deckitron ready');
    });
}());
