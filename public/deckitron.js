/*global angular*/
(function () {
    'use strict';
    const app = angular.module('deckitron', []);

    app.controller('DeckitronCore', ['$scope', function ($scope) {
        $scope.test = 'Deckitron';
    }]);
})();
