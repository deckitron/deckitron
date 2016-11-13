/* global angular*/
(function () {
    'use strict';


    const rMana = /\{([0-9bgrcwuptx]{1,2})\}/ig;
    const rManaTest = /\{([0-9bgrcwuptx]{1,2})\}/i;
    const rManaText = /(\{[0-9bgrcwuptx]{1,2}\})/ig;
    const app = angular.module(
        'deckitron',
        [
            'ngMaterial',
            'room',
            'chat',
            'posterwall',
            'cardTypesController',
            'manaColorController',
            'rarityController',
            'filters',
            'deckStats'
        ]
    );

    app.config(($mdThemingProvider) => {
        $mdThemingProvider.theme('default')
            .primaryPalette('pink')
            .accentPalette('indigo')
            .dark();
    });


    function getManaList (manaCost) {
        const costs = [];
        const mana = String(manaCost).toLowerCase();
        let match;
        while (match = rMana.exec(mana)) {
            costs.push(match[1]);
        }
        return costs;
    }
    function getManaText (text) {
        const parts = text.split(rManaText);
        const output = [];
        for (let i = 0; i < parts.length; i++) {
            if (!parts[i]) {
                continue;
            }
            if (rManaTest.test(parts[i])) {
                output.push({
                    mana: true,
                    value: parts[i].substr(1, parts[i].length - 2).toLowerCase()
                });
            } else {
                output.push({
                    mana: false,
                    value: parts[i]
                });
            }
        }
        return output;
    }
    function getCardImageURL (id) {
        let normalizedID = id;
        if (!normalizedID) {
            normalizedID = 0;
        }
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + normalizedID + '&type=card';
    }

    app.controller('DeckitronCore', ['$scope', 'room', '$mdDialog', function ($scope, $room, $mdDialog) {
        $scope.title = 'Deckitron';

        const socket = $room.getSocket();

        $scope.getCardImageURL = getCardImageURL;
        function DialogController ($scope, card) {
            $scope.card = card;
            $scope.card.manaList = $scope.card.manaCost ? getManaList($scope.card.manaCost) : null;
            $scope.card.manaText = $scope.card.text ? getManaText($scope.card.text) : null;
            $scope.count = 1;
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.hide();
            };

            $scope.listCount = function (list) {
                return cardCount(card, list);
            };

            $scope.addCard = function (list, count) {
                addCard($scope.card, list, count || $scope.count);
                $mdDialog.hide();
            };
            $scope.removeCard = function (list, count) {
                removeCard($scope.card, list, count || $scope.count);
                $mdDialog.hide();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            $scope.getCardImageURL = getCardImageURL;
        }


        function addCard (card, list, count) {
            socket.emit('cards.deck.add', {
                list: list,
                card: {
                    id: card.id,
                    count: count
                }
            });
            if (list === 'linked') {
                socket.emit('chat.sharecard', card.id);
            }
        }
        function removeCard (card, list, count) {
            socket.emit('cards.deck.remove', {
                list: list,
                card: {
                    id: card.id,
                    count: count
                }
            });
        }
        function cardCount (card, list) {
            const deck = $room.getDeck();
            if (!deck || !deck[list]) {
                return 0;
            }
            for (let i = 0; i < deck[list].length; i += 1) {
                if (card.id === deck[list][i].id) {
                    return deck[list][i].count;
                }
            }
            return 0;
        }

        $scope.cardCount = cardCount;

        $scope.cardSelected = function (ev, card) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'public/cardinfo.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals: {
                    card: card,
                    addCard: addCard,
                    removeCard: removeCard
                }
            })
            .then((answer) => {
                $scope.status = `You said the information was ${answer}.`;
            }, () => {
                $scope.status = 'You cancelled the dialog.';
            });
        };
        $scope.menuAddCard = function (card, list) {
            addCard(card, list, 1);
        };
        $scope.menuRemoveCard = function (card, list) {
            removeCard(card, list, 1);
        };
        $scope.menuListCount = function (card, list) {
            return cardCount(card, list);
        };
    }]);

    app.run(($log) => {
        $log.debug('Deckitron ready');
    });

    app.directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    });
    app.directive('mousepointMenu', function () {
        return {
            restrict: 'A',
            require: 'mdMenu',
            link: function($scope, $element, $attrs, mdMenuCtrl) {
                var MousePointMenuCtrl = mdMenuCtrl;

                $scope.$mdOpenMousepointMenu = function($event) {
                    MousePointMenuCtrl.offsets = function() {
                        return {
                            left: $event.offsetX,
                            top: $event.offsetY
                        };
                    };
                    MousePointMenuCtrl.open($event);
                };
            }

        };
    });
}());
