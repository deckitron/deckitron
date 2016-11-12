/* global angular */
(function () {
    'use strict';

    const chat = angular.module('chat', []);

    chat.controller('chat', ['$scope', '$q', function ($scope, $q) {
        let sock = null;
        $scope.messages = [];
        $scope.connectedUsers = [
            {
                name: 'Matt'
            },
            {
                name: 'Sean'
            },
            {
                name: 'Damian'
            }
        ];

        $scope.sendMessage = function () {
            sock.emit('new message', $scope.newMessage);
            $scope.newMessage = '';
            return false;
        };
        function recieveMessage (data) {
            $q((resolve) => {
                $scope.messages.push(data);
                resolve();
            })
            .then(() => {
                console.log('test');
            });
        }

        window.chat = function (socket) {
            sock = socket;
            sock.on('message', recieveMessage);
        };
    }]);
}());
