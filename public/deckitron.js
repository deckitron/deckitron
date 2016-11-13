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

    app.controller('DeckitronCore', ['$scope', 'room', '$mdDialog', '$timeout', '$mdSidenav', '$mdMedia', function ($scope, $room, $mdDialog, $timeout, $mdSidenav, $mdMedia) {
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
            socket.emit('chat.sharecard', card.id);
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
    }]);


    // app.directive('ngRightClick', ($parse) => {
    //     return function (scope, element, attrs) {
    //         const fn = $parse(attrs.ngRightClick);
    //         element.bind('contextmenu', (event) => {
    //             scope.$apply(() => {
    //                 event.preventDefault();
    //                 fn(scope, {
    //                     $event:event
    //                 });
    //             });
    //         });
    //     };
    // });
    // app.directive('mousepointMenu', [function (){
    //     return {
    //         restrict: 'A',
    //         require: 'mdMenu',
    //         link: function ($scope, $element, $attrs, RightClickContextMenu){
    //             let prev = {
    //                 x: 0,
    //                 y: 0
    //             };
    //             $scope.$mdOpenMousepointMenu = function ($event){
    //                 RightClickContextMenu.offsets = function (){
    //                     const mouse = {
    //                         x: $event.clientX,
    //                         y: $event.clientY
    //                     };
    //                     const offsets = {
    //                         left: mouse.x - prev.x,
    //                         top: mouse.y - prev.y
    //                     };
    //                     prev = mouse;
    //
    //                     return offsets;
    //                 };
    //                 RightClickContextMenu.open($event);
    //             };
    //         }
    //
    //     };
    // }]);
    // app.controller('RightClickContextMenu', (function DemoCtrl ($scope) {
    //   // input model
    //     $scope.model = {
    //         text: 'Right click me!'
    //     };
    //
    //   // placeholder for the copied/cut value
    //     $scope.placeHolder = '';
    //
    //   // context menu array
    //     $scope.array = [
    //         {
    //             active: true,
    //             value: 'Copy'
    //         },
    //         {
    //             active: true,
    //             value: 'Cut'
    //         },
    //         {
    //             active: false,
    //             value: 'Paste'
    //         }
    //     ];
    //
    //   // gets triggered when an item in the context menu is selected
    //     $scope.process = function (item, ev){
    //         if (item.value == 'Copy'){
    //             $scope.placeHolder = $scope.model.text; // copy text
    //         } else if (item.value == 'Cut'){
    //             $scope.placeHolder = $scope.model.text; // cut text
    //             $scope.model.text = '';
    //         } else {
    //             $scope.model.text += $scope.placeHolder; // paste text
    //         }
    //     };
    //
    //   // watches if the placeholder has something to paste
    //     $scope.$watchCollection('placeHolder', (newValue, oldValue) => {
    //         if (newValue == '') {
    //             $scope.array[2].active = false;
    //         } else {
    //             $scope.array[2].active = true;
    //         }
    //     });
    // }()));
}());
