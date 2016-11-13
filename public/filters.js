/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', ['room']);

    filters.controller('filters', ['$scope', 'room', '$timeout', function ($scope, $room, $timeout) {
        const socket = $room.getSocket();
        $scope.cardLists = [
            {
                name: 'All Cards',
                listid: '',
                icon: 'public/icons/all_cards.svg',
                selected: true
            },
            {
                name: 'Deck',
                listid: 'cards',
                icon: 'public/icons/deck.svg',
                selected: false
            },
            {
                name: 'Sideboard',
                listid: 'sideboard',
                icon: 'public/icons/sideboard.svg',
                selected: false
            },
            {
                name: 'Linked',
                listid: 'linked',
                icon: 'public/icons/linked.svg',
                selected: false
            }
        ];

        socket.on('cards.deck.update', function (data) {
            const selectedList = $scope.getSelectedList();
            if (data.list === selectedList.listid) {
                socket.emit('cards.get', {
                    list: selectedList.listid
                });
            }
        });

        $timeout(() => {
            socket.emit('cards.get');
        }, 500);


        $scope.selectList = function (cardListToSelect) {
            const selectedList = $scope.getSelectedList();
            if (cardListToSelect === selectedList) {
                return;
            }

            cardListToSelect.selected = true;
            selectedList.selected = false;
            socket.emit('cards.get', {
                list: cardListToSelect.listid
            });
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
