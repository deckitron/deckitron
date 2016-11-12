/*global angular*/
(function () {
    'use strict';
    const app = angular.module('deckitron', []);

    app.controller('DeckitronHome', ['$scope', function ($scope) {
        $scope.title = 'DeckitronHome';
    }]);
})();
