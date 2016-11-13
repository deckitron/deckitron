/* global angular*/
(function () {
    'use strict';

    const app = angular.module(
        'deckitron',
        [
            'ngMaterial',
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

    app.controller('DeckitronCore', ['$scope', function ($scope) {
        $scope.title = 'Deckitron';
    }]);

    app.run(($log) => {
        $log.debug('Deckitron ready');
    });

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
