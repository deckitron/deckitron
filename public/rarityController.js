(function () {
    'use strict';

    const rarityController = angular.module('rarityController', []);

    rarityController.controller('rarityController', ['$scope', 'room', function ($scope, $room) {
        const socket = $room.getSocket();
        $scope.readonly = false;
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.selectedCards = [];
        $scope.rarities = [];
        $scope.numberChips = [];
        $scope.numberChips2 = [];
        $scope.numberBuffer = '';
        $scope.autocompleteDemoRequireMatch = true;
        $scope.transformChip = transformChip;

        $scope.onChange = function () {
            if ($scope.selectedCards.length < 1) {
                $scope.$emit('card-rarity', null);
            } else {
                $scope.$emit('card-rarity', $scope.selectedCards);
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
         * Search for rarities.
         */
        function querySearch (query) {
            const results = query ? $scope.rarities.filter(createFilterFor(query)) : [];
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
            const rarities = [];
            // console.log('Got distincts results');
            // console.log(data);
            if (data.field === 'rarity') {
                // console.log('Got rarity data');
                for (let i = 0; i < data.result.length; i++) {
                    rarities.push({
                        name: data.result[i]
                    });
                }
                const mapped = rarities.map((card) => {
                    card._lowername = card.name.toLowerCase();
                    return card;
                });
                $scope.selectedCards.push(rarities[rarities.length - 1]);
                $scope.$emit('card-rarity', $scope.selectedCards);
                $scope.rarities = mapped;
            }
        });
        socket.on('room.joined', function () {
            socket.emit('cards.distincts.get', {
                field: 'rarity'
            });
        });
    }]);
}());
