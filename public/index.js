/*global angular*/
(function () {
    'use strict';
    const app = angular.module('deckitron', []);

    app.controller('DeckitronHome', ['$scope', '$window', function ($scope, $window) {
        $scope.title = 'DeckitronHome';
        $scope.onStart = function () {
            $window.location.href = '/' + $scope.deckName;
        };
    }]);
})();
