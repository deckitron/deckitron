/*global angular*/
(function () {
    'use strict';
    const app = angular.module('deckitron', ['slug']);

    app.controller('DeckitronHome', ['$scope', '$window', 'slug', function ($scope, $window, slug) {
        $scope.title = 'DeckitronHome';
        $scope.onStart = function () {
            $window.location.href = '/' + slug($scope.deckName);
        };
    }]);
})();
