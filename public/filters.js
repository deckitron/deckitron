/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', []);

    filters.controller('filters', ['$scope', function ($scope) {
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

        $scope.selectList = function (cardListToSelect) {
            const selectedList = $scope.getSelectedList();

            cardListToSelect.selected = true;
            selectedList.selected = false;
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
