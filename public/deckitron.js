/* global angular*/
(function () {
    'use strict';

    const app = angular.module('deckitron', ['ngMaterial']);


    app.config(($sceDelegateProvider) => {
          // NOTE: The following config is required because we're
          //       loading this within JSBin
          // Allow same origin resource loads.
          // Allow loading from our assets domain.  Notice the difference
          // between * and **.
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://rawgit.com/angular/material-start/es5-tutorial/app/assets/svg/**'
        ]);
    });

    app.controller('DeckitronCore', ['$scope', function ($scope) {
        $scope.title = 'Deckitron';
    }]);

    app.run(($log) => {
        $log.debug('Deckitron ready');
    });
}());
