/*global angular*/
(function () {
    'use strict';
    const app = angular.module('deckitron', ['slug']);

    app.controller('DeckitronHome', ['$scope', '$window', 'slug', function ($scope, $window, slug) {
        $scope.title = 'DeckitronHome';
        $scope.onStart = function () {
            var sluggedDeckName = $scope.deckName ? slug($scope.deckName) : null;
            if (sluggedDeckName) {
                $window.location.href = '/' + sluggedDeckName;
            } else {
                $scope.ErrMsg = "Invalid Deck Name";
            }
        };
    }]);
})();
