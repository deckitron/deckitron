/* global angular*/
(function () {
    'use strict';

    const app = angular.module('deckitron', ['ngMaterial', 'chat']);

    // The default card filters
    const CARD_FILTERS = [];

    app.controller('DeckitronCore', ['$scope', function ($scope) {
        $scope.title = 'Deckitron';
        $scope.cardLists = [
            {
                name: 'All Cards',
                // slice to not use the same array for all card lists
                items: CARD_FILTERS.slice()
            },
            {
                name: 'Deck',
                // slice to not use the same array for all card lists
                items: CARD_FILTERS.slice()
            },
            {
                name: 'Sideboard',
                // slice to not use the same array for all card lists
                items: CARD_FILTERS.slice()
            },
            {
                name: 'Linked',
                // slice to not use the same array for all card lists
                items: CARD_FILTERS.slice()
            }
        ];
      /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
        $scope.toggleList = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
    }]);

    app.run(($log) => {
        $log.debug('Deckitron ready');
    });
}());
