(function () {
    'use strict';

    const cardSubtypesController = angular.module('cardSubtypesController', []);

    cardSubtypesController.controller('cardSubtypesController', ['$scope', 'room', function ($scope, $room) {
        const socket = $room.getSocket();
        $scope.readonly = false;
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.cardSubtypes = [];
        $scope.selectedCards = [];
        $scope.numberChips = [];
        $scope.numberChips2 = [];
        $scope.numberBuffer = '';
        $scope.autocompleteDemoRequireMatch = true;
        $scope.transformChip = transformChip;

        $scope.onChange = function () {
            if ($scope.selectedCards.length < 1) {
                $scope.$emit('card-sub-types', null);
            } else {
                $scope.$emit('card-sub-types', $scope.selectedCards);
            }
        };

        $scope.$on('clear-filters', function () {
            $scope.selectedCards.length = 0;
            $scope.onChange();
        });

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
         * Search for cardSubtypes.
         */
        function querySearch (query) {
            const results = query ? $scope.cardSubtypes.filter(createFilterFor(query)) : [];
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

        socket.on('cards.distincts.get.result', function (data) {
            const cardSubtypes = [];
            if (data.field === 'subtypes') {
                for (let i = 0; i < data.result.length; i++) {
                    cardSubtypes.push({
                        name: data.result[i]
                    });
                }
                $scope.cardSubtypes = cardSubtypes.map((card) => {
                    card._lowername = card.name.toLowerCase();
                    return card;
                });
            }
        });
        socket.emit('cards.distincts.get', {
            field: 'subtypes'
        });
    }]);
}());
