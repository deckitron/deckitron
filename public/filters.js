/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', []);

    filters.controller('filters', ['$rootScope', function ($rootScope) {
        $rootScope.cardLists = [
            {
                name: 'All Cards',
                icon: 'public/icons/all_cards.svg'
            },
            {
                name: 'Deck',
                icon: 'public/icons/deck.svg'
            },
            {
                name: 'Sideboard',
                icon: 'public/icons/sideboard.svg'
            },
            {
                name: 'Linked',
                icon: 'public/icons/linked.svg'
            }
        ];
    }]);

    filters.run(($log) => {
        $log.debug('filters running');
    });
}());
