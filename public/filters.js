/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', []);

    filters.controller('filters', ['$rootScope', function ($rootScope) {
        $rootScope.cardLists = [
            {
                name: 'All Cards',
                icon: ''
            },
            {
                name: 'Deck',
                icon: ''
            },
            {
                name: 'Sideboard',
                icon: ''
            },
            {
                name: 'Linked',
                icon: ''
            }
        ];
    }]);

    filters.run(($log) => {
        $log.debug('filters running');
    });
}());
