/* global angular */
(function () {
    'use strict';

    const chat = angular.module('chat', []);

    chat.controller('chat', ['$scope', '$q', function ($scope, $q) {
        const chatEl = document.getElementById('chat-messages');
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

        /**
         * Checks if the chat element is scrolled to the bottom
         * @returns {Boolean} True if at bottom, false otherwise
         */
        function isScrollAtBottom () {
            const position = chatEl.scrollTop + chatEl.offsetHeight;
            const bottom = chatEl.scrollHeight;
            return position >= bottom;
        }
        /**
         * Scrolls the contents of chat to the bottom
         */
        function scrollToBottomOfChat () {
            chatEl.scrollTop = chatEl.scrollHeight;
        }
        /**
         * Recieves a messages from the chat server
         * @param   {Object} data A Chat message and a user Object
         */
        function recieveMessage (data) {
            const scrollToBottom = isScrollAtBottom();
            // Use $q to make it handle digest better
            $q((resolve) => {
                $scope.messages.push(data);

                // HACK: For some reason it's not applying at the end of the $q
                // so call it manually here
                $scope.$apply();

                resolve();
            })
            .then(() => {
                if (scrollToBottom) {
                    scrollToBottomOfChat();
                }
            });
        }
        $scope.sendMessage = function () {
            sock.emit('new message', $scope.newMessage);
            $scope.newMessage = '';
            scrollToBottomOfChat();
            return false;
        };

        window.chat = function (socket) {
            sock = socket;
            sock.on('message', recieveMessage);
        };
    }]);
}());
