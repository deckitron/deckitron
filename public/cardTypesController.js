(function () {
    'use strict';

    const cardTypesController = angular.module('cardTypesController', []);

    cardTypesController.controller('cardTypesController', ['$scope', function ($scope) {
        $scope.readonly = false;
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.cardTypes = loadTypes();
        $scope.selectedCards = [];
        $scope.numberChips = [];
        $scope.numberChips2 = [];
        $scope.numberBuffer = '';
        $scope.autocompleteDemoRequireMatch = true;
        $scope.transformChip = transformChip;

        /**
         * Return the proper object when the append is called.
         */
        function transformChip (chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return {
                name: chip
            };
        }

        /**
         * Search for cardTypes.
         */
        function querySearch (query) {
            const results = query ? $scope.cardTypes.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor (query) {
            const lowercaseQuery = angular.lowercase(query);

            return function filterFn (card) {
                return card._lowername.indexOf(lowercaseQuery) === 0;
            };
        }

        function loadTypes () {
            const cardTypes = [
                {name: 'Creature'},
                {name: 'Instant'},
                {name: 'Enchantment'},
                {name: 'Artifact'},
                {name: 'Sorcery'},
                {name: 'Land'},
                {name: 'Planeswalker'},
                {name: 'Vanguard'},
                {name: 'Tribal'},
                {name: 'Enchant'},
                {name: 'Player'},
                {name: 'Ever'},
                {name: 'Scariest'},
                {name: 'See'},
                {name: 'You\'ll'},
                {name: 'Eaturecray'},
                {name: 'Plane'},
                {name: 'Scheme'},
                {name: 'Phenomenon'},
                {name: 'Conspiracy'}
            ];

            return cardTypes.map((card) => {
                card._lowername = card.name.toLowerCase();
                return card;
            });
        }
    }]);
}());
