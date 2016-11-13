/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', ['manaColorController', 'cardTypesController', 'room']);

    // filters.controller('filters', ['$scope', 'room', '$timeout', 'manaColorController', 'cardTypesController', function ($scope, $room, $timeout, $manaColorController, $cardTypesController) {
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
                color: '#03A9F4',
                icon: 'public/icons/deck.svg',
                selected: false
            },
            {
                name: 'Sideboard',
                listid: 'sideboard',
                color: '#4CAF50',
                icon: 'public/icons/sideboard.svg',
                selected: false
            },
            {
                name: 'Linked',
                listid: 'linked',
                color: '#E040FB',
                icon: 'public/icons/linked.svg',
                selected: false
            }
        ];
        let cardTypes = null;
        let manaColor = null;
        let cardRarity = null;

        $scope.$on('card-types', function (evt, types) {
            cardTypes = types;
        });
        $scope.$on('mana-color', function (evt, color) {
            manaColor = color;
        });
        $scope.$on('card-rarity', function (evt, rarities) {
            cardRarity = rarities;
        });


        socket.on('cards.deck.update', function (data) {
            const selectedList = $scope.getSelectedList();
            if (data.list === selectedList.listid) {
                socket.emit('cards.get', {
                    list: selectedList.listid
                });
            }
        });

        $timeout(() => {
            $scope.performSearch();
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

        $scope.performSearch = function () {
            const query = {};
            const formElements = document.forms.filter.children;

            // The input form elements
            const cardName = formElements[3].children[1].value;
            const convertedManaCost = formElements[4].children[1].value;
            if (convertedManaCost) {
                query.cmc = convertedManaCost;
            }
            const power = formElements[8].children[1].value;
            if (power) {
                query.power = power;
            }
            const toughness = formElements[9].children[1].value;
            if (toughness) {
                query.toughness = toughness;
            }
            const artist = formElements[10].children[1].value;
            if (artist) {
                query.artist = artist;
            }

            if (manaColor) {
                query.colorIdentity = [];
                for (let i = 0; i < manaColor.length; i++) {
                    query.colorIdentity.push(manaColor[i].queryParam);
                }
            }
            if (cardTypes) {
                query.types = [];
                for (let i = 0; i < cardTypes.length; i++) {
                    query.types.push(cardTypes[i].name);
                }
            }
            if (cardRarity) {
                query.rarity = [];
                for (let i = 0; i < cardRarity.length; i++) {
                    query.rarity.push(cardRarity[i].name);
                }
            }

            socket.emit('cards.get', {
                list: $scope.getSelectedList().listid,
                keywords: cardName,
                query: query
            });
        };
    }]);

    filters.run(($log) => {
        $log.debug('filters running');
    });
}());
