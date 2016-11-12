/* global angular */
(function () {
    'use strict';

    const chat = angular.module('chat', ['room']);

    chat.controller('chat', ['$scope', '$q', 'room', function ($scope, $q, $room) {
        const chatEl = document.getElementById('chat-messages');
        $scope.messages = [];
        $scope.connectedUsers = [];

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

        /**
         * Adds a user to the connected list
         * @param   {Object} user A user Object
         */
        function userConnected (user) {
            $scope.connectedUsers.push(user);
        }

        /**
         * Removes a user from the connected list
         * @param   {Object} user A user Object
         */
        function userDisconnected (user) {
            for (let i = 0; i < $scope.connectedUsers.length; i++) {
                const item = $scope.connectedUsers[i];
                if (item.id === user.id) {
                    $scope.connectedUsers.splice(i, 1);
                    return;
                }
            }
        }

        /**
         * Updates a user in the connected list
         * @param   {Object} user A user Object
         */
        function userUpdated (user) {
            for (let i = 0; i < $scope.connectedUsers.length; i++) {
                const item = $scope.connectedUsers[i];
                if (item.id === user.id) {
                    $scope.connectedUsers[i] = user;
                    return;
                }
            }
        }

        /**
         * Handles connecting to chat and getting initial data
         * @param   {Object} data Initial chat data
         */
        function chatConnected (data) {
            // $scope.messages = data.messages = [];
            $scope.$apply(() => {
                $scope.connectedUsers = data.users;
            });
        }
        $scope.sendMessage = function () {
            $room.getSocket()
                .emit('chat.newmessage', $scope.newMessage);
            $scope.newMessage = '';
            scrollToBottomOfChat();
            return false;
        };

        function connectChat () {
            const socket = $room.getSocket();
            socket.on('chat.message', recieveMessage);
            socket.on('chat.user.connected', userConnected);
            socket.on('chat.user.disconnected', userDisconnected);
            socket.on('chat.user.updated', userUpdated);
            socket.on('chat.connected', chatConnected);
        }

        connectChat();
    }]);
}());
