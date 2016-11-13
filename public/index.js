/* global angular, io*/
(function () {
    'use strict';

    const app = angular.module('deckitron', ['slug']);
    const socket = io();

    app.controller(
        'DeckitronHome',
        [
            '$scope',
            '$window',
            'slug',
            '$timeout',
            function ($scope, $window, $slug, $timeout) {
                $scope.onStart = function () {
                    const sluggedDeckName = $scope.deckName
                        ? $slug($scope.deckName)
                        : null;
                    if (sluggedDeckName) {
                        $window.location.href = '/' + sluggedDeckName;
                    } else {
                        $scope.ErrMsg = 'Invalid Deck Name';
                    }
                };

                socket.on('connected', (data) => {
                    socket.user = data;
                    socket.emit('rooms.watch');
                });
                socket.on('rooms.list', (data) => {
                    $timeout(() => {
                        $scope.decks = data;
                    });
                });
            }
        ]
    );
}());
