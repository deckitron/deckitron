/* global angular */
(function () {
    'use strict';

    const deckStats = angular.module('deckStats', ['room', 'ngMaterial']);

    deckStats.controller('deckStats', ['$scope', 'room', '$mdDialog', function ($scope, $room, $mdDialog) {
        $scope.onCharmSelected = function (ev) {
            // const confirm = $mdDialog.alert()
            //      .title('Deck Statistics')
            //      .textContent('Replace this with a custom template with graphs')
            //      .clickOutsideToClose(true)
            //      .ariaLabel('Deck Statistics')
            //      .targetEvent(ev)
            //      .ok('Close');
            //
            // $mdDialog.show(confirm);
        };

        //TODO: listen to the socket and update mana costs when we see something get added or removed
        $scope.white = 0;
        $scope.blue = 0;
        $scope.black = 0;
        $scope.red = 0;
        $scope.green = 0;
    }]);
}());
