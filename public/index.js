/* global angular*/
(function () {
    'use strict';

    const app = angular.module('deckitron', ['slug']);

    app.controller('DeckitronHome', ['$scope', '$window', 'slug',
        function ($scope, $window, slug) {
            $scope.onStart = function () {
                const sluggedDeckName = $scope.deckName
                    ? slug($scope.deckName)
                    : null;
                if (sluggedDeckName) {
                    $window.location.href = '/' + sluggedDeckName;
                } else {
                    $scope.ErrMsg = 'Invalid Deck Name';
                }
            };
        }]);
}());
