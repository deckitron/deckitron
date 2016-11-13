/* global angular*/
(function () {
    'use strict';


    const rMana = /\{([0-9bgrcwuptx])(?:\/([bgrcwuptx]))?\}/ig;
    const rManaTest = /\{([0-9bgrcwuptx])(?:\/[bgrcwuptx])?\}/i;
    const rManaText = /(\{[0-9bgrcwuptx](?:\/[bgrcwuptx])?\})/ig;
    const app = angular.module(
        'deckitron',
        [
            'ngMaterial',
            'room',
            'chat',
            'posterwall',
            'cardTypesController',
            'cardSuperTypesController',
            'cardSubtypesController',
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
            let m = match[1];
            if (match[2]) {
                m += match[2];
            }
            costs.push(m);
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
                    value: parts[i].substr(1, parts[i].length - 2).replace('/', '').toLowerCase()
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

    function hasNoImage (id) {
        return id == null;
    }

    app.controller('DeckitronCore', ['$scope', 'room', '$mdDialog', '$timeout', '$mdSidenav', '$mdMedia', function ($scope, $room, $mdDialog, $timeout, $mdSidenav, $mdMedia) {
        $scope.title = 'Deckitron';

        const socket = $room.getSocket();

        $scope.currentListName = 'All Cards';
        $scope.$on('list-selected', function (evt, name) {
            $scope.currentListName = name;
        });

        $scope.getCardImageURL = getCardImageURL;
        $scope.hasNoImage = hasNoImage;
        $scope.getManaList = getManaList;
        function DialogController ($scope, card) {
            $scope.card = card;
            $scope.card.manaList = $scope.card.manaCost ? getManaList($scope.card.manaCost) : null;
            $scope.card.manaText = $scope.card.text ? getManaText($scope.card.text) : null;
            $scope.cardsCount = cardCount(card, 'cards');
            $scope.sideboardCount = cardCount(card, 'sideboard');
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.hide();
            };

            $scope.addCard = function (list, count) {
                addCard($scope.card, list, count || $scope.count);
                $scope[list + 'Count']++;
            };
            $scope.removeCard = function (list, count) {
                removeCard($scope.card, list, count || $scope.count);
                $scope[list + 'Count']--;
                if ($scope[list + 'Count'] < 1) {
                    $scope[list + 'Count'] = 0;
                }
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

        $scope.toggleLeftSideNav = function () {
            $mdSidenav('leftSideNav')
              .toggle();
        };
        $scope.isLeftSideNavOpen = function () {
            return $mdSidenav('leftSideNav')
                .isOpen();
        };

        $scope.toggleRightSideNav = function () {
            $mdSidenav('rightSideNav')
              .toggle();
        };
        $scope.isRightSideNavOpen = function () {
            return $mdSidenav('rightSideNav')
                .isOpen();
        };
        $timeout(() => {
            if ($mdMedia('gt-md')) {
                $scope.toggleRightSideNav();
                $scope.toggleLeftSideNav();
            }
        }, 500);
        $scope.menuAddCard = function (card, list) {
            addCard(card, list, 1);
        };
        $scope.menuRemoveCard = function (card, list) {
            removeCard(card, list, 1);
        };
        $scope.menuListCount = function (card, list) {
            return cardCount(card, list);
        };

        $scope.changeName = function (ev) {
            const confirm = $mdDialog.prompt()
                 .title('What would you name to be')
                 .textContent('By default you will be named after a random Planeswalker.')
                 .clickOutsideToClose(true)
                 .placeholder('Input name')
                 .ariaLabel('Input name')
                 .targetEvent(ev)
                 .ok('Update Name')
                 .cancel('Keep "' + $scope.me.name + '"');

            $mdDialog.show(confirm)
                .then((newName) => {
                    if (!newName || newName === $scope.me.name) {
                        return;
                    }
                    $scope.me.name = newName;

                    $room.getSocket()
                        .emit('chat.user.update', $scope.me);
                });
        };
        $room.getSocket().on('connected', (data) => {
            $scope.me = data;
        });
    }]);


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
