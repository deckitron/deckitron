/* global angular*/
(function () {
    'use strict';

    const app = angular.module(
        'deckitron',
        [
            'ngMaterial',
            'ngLetterAvatar',
            'chat',
            'filters'
        ]
    );

    app.config(($mdThemingProvider) => {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink')
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
