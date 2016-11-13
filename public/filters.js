/* global angular */
(function () {
    'use strict';

    const filters = angular.module('filters', ['manaColorController', 'cardTypesController', 'room']);
    filters.controller('filters', ['$scope', '$rootScope', 'room', '$timeout', function ($scope, $rootScope, $room, $timeout) {
        const socket = $room.getSocket();
        $scope.cardLists = [
            {
                name: 'All Cards',
                listid: '',
                icon: 'public/icons/all_cards.svg',
                selected: true,
                cacheid: 'allCards'
            },
            {
                name: 'Deck',
                listid: 'cards',
                color: '#03A9F4',
                icon: 'public/icons/deck.svg',
                selected: false,
                cacheid: 'decks'
            },
            {
                name: 'Sideboard',
                listid: 'sideboard',
                color: '#4CAF50',
                icon: 'public/icons/sideboard.svg',
                selected: false,
                cacheid: 'sideboard'
            },
            {
                name: 'Linked',
                listid: 'linked',
                color: '#E040FB',
                icon: 'public/icons/linked.svg',
                selected: false,
                cacheid: 'linked'
            }
        ];


        const lastEvent = {};

        lastEvent[$scope.cardLists[1].cacheid] = {
            list: $scope.cardLists[1].listid
        };
        lastEvent[$scope.cardLists[2].cacheid] = {
            list: $scope.cardLists[2].listid
        };
        lastEvent[$scope.cardLists[3].cacheid] = {
            list: $scope.cardLists[3].listid
        };

        let cardTypes = null;
        let manaColor = null;
        let cardRarity = null;
        let offset = 0;
        let debounce = false;

        $scope.$on('block-paged-load', function () {
            console.log('Paged load blocked');
            offset--;
        });

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
                $rootScope.$broadcast('clear-card-wall');
                socket.emit('cards.get', {
                    list: selectedList.listid,
                    page: {
                        offset: offset * 50
                    }
                });
            }
        });

        $timeout(() => {
            $scope.performSearch();
        }, 500);

        socket.on('cards.get.result', function (data) {
            if (!Array.isArray(data.result) || data.result.length < 1) {
                offset--;
            }
            debounce = false;
        });

        function onScroll () {
            const oldOffset = offset;
            const val = cardWallElem.scrollTop;
            const percent = val / (cardWallElem.children[0].clientHeight - cardWallElem.clientHeight);
            if (debounce) {
                return;
            }
            debounce = true;
            if (percent >= 0.9) {
                offset++;
            }
            if (offset <= 0) {
                debounce = false;
                return;
            }
            // if (percent <= 0.1) {
            //     offset--;
            // }
            console.log(offset);
            if (offset === oldOffset) {
                debounce = false;
                return;
            }
            $scope.performSearch();
        }

        const cardWallElem = document.querySelector('#cardContent');
        cardWallElem.addEventListener('scroll', onScroll);


        $scope.selectList = function (cardListToSelect) {
            const selectedList = $scope.getSelectedList();
            if (cardListToSelect === selectedList) {
                return;
            }

            cardListToSelect.selected = true;
            selectedList.selected = false;

            offset = 0;
            $rootScope.$broadcast('clear-card-wall');

            // use the last query, but don't scroll to top
            $scope.performSearch(false, lastEvent[$scope.getSelectedList().cacheid]);
        };

        $scope.getSelectedList = function () {
            for (let i = 0; i < $scope.cardLists.length; i++) {
                if ($scope.cardLists[i].selected === true) {
                    return $scope.cardLists[i];
                }
            }
            return null;
        };

        function buildQuery () {
            const queryEvent = {
                list: $scope.getSelectedList().listid
            }
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

            queryEvent.keywords = cardName;
            queryEvent.query = query;
            return queryEvent;
        }
        $scope.performSearch = function (scrollToTop, eventToSend) {
            let queryEvent = null;
            if (scrollToTop) {
                document.getElementById('cardContent').scrollTop = 0;
                offset = 0;
                $rootScope.$broadcast('clear-card-wall');
            }
            if (!eventToSend) {
                queryEvent = buildQuery();
            } else {
                queryEvent = eventToSend;
            }

            lastEvent[$scope.getSelectedList().cacheid] = queryEvent;

            queryEvent.page = {
                offset: offset * 50
            };

            socket.emit('cards.get', queryEvent);
        };
        $scope.clearFilters = function () {
            $rootScope.$broadcast('clear-filters');
        };
    }]);

    filters.run(($log) => {
        $log.debug('filters running');
    });
}());
