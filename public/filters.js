/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', ['room']);

    filters.controller('filters', ['$scope', 'room', '$timeout', function ($scope, $room, $timeout) {
        const socket = $room.getSocket();
        $scope.cardLists = [
            {
                name: 'All Cards',
                icon: 'public/icons/all_cards.svg',
                selected: true
            },
            {
                name: 'Deck',
                icon: 'public/icons/deck.svg',
                selected: false
            },
            {
                name: 'Sideboard',
                icon: 'public/icons/sideboard.svg',
                selected: false
            },
            {
                name: 'Linked',
                icon: 'public/icons/linked.svg',
                selected: false
            }
        ];

        $timeout(() => {
            socket.emit('cards.get');
        }, 500);


        $scope.selectList = function (cardListToSelect) {
            const selectedList = $scope.getSelectedList();

            cardListToSelect.selected = true;
            selectedList.selected = false;
            socket.emit('cards.get');
        };

        $scope.getSelectedList = function () {
            for (let i = 0; i < $scope.cardLists.length; i++) {
                if ($scope.cardLists[i].selected === true) {
                    return $scope.cardLists[i];
                }
            }
            return null;
        };
    }]);

    filters.run(($log) => {
        $log.debug('filters running');
    });
}());
