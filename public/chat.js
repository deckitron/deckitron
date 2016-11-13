/* global angular, jQuery */
(function () {
    'use strict';

    const chat = angular.module('chat', ['room']);

    // max 1 raptor per 60 secconds
    const raptorThrottle = 60000;

    chat.controller('chat', ['$scope', '$q', '$timeout', 'room', '$mdDialog', function ($scope, $q, $timeout, $room, $mdDialog) {
        const chatEl = document.getElementById('chat-messages');
        $scope.messages = [];
        $scope.connectedUsers = [];
        let lastRaptor = 0;

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
         * Adds a message to the listen
         * @param {Object} user    A user Object
         * @param {string} message The message
         * @param {string} type    Optional. The type of message (system).
         */
        function addMessage (user, message, type) {
            // const scrollToBottom = isScrollAtBottom();
            $scope.$apply(() => {
                $scope.messages.push({
                    user: user,
                    message: message,
                    type: type
                });
                $timeout(() => {
                    scrollToBottomOfChat();
                });
            });
        }
        function addCard (user, card) {
            $scope.$apply(() => {
                $scope.messages.push({
                    user: user,
                    card: card
                });
                $timeout(() => {
                    scrollToBottomOfChat();
                });
            });
        }

        function raptorize () {
            const time = Date.now();
            if (time - raptorThrottle > lastRaptor) {
                lastRaptor = time;
                jQuery(document)
                    .raptorize({
                        enterOn: 'timer',
                        delayTime: 2000
                    });
            }
            return;
        }
        /**
         * Recieves a messages from the chat server
         * @param   {Object} data A Chat message and a user Object
         */
        function recieveMessage (data) {
            console.log('recieve message', data);
            addMessage(data.user, data.message);
        }
        /**
         * Recieves a messages from the chat server
         * @param   {Object} data A Chat message and a user Object
         */
        function recieveCard (data) {
            console.log('recieve card', data);
            addCard(data.user, data.card);
        }

        /**
         * Adds a user to the connected list
         * @param   {Object} user A user Object
         */
        function userConnected (user) {
            console.log('user connected', user);
            addMessage(user, `${user.name} joined the room`, 'room');
            $scope.$apply(() => {
                $scope.connectedUsers.push(user);
            });
        }

        /**
         * Removes a user from the connected list
         * @param   {Object} user A user Object
         */
        function userDisconnected (user) {
            console.log('user disconnected', user);
            addMessage(user, `${user.name} left the room`, 'room');
            for (let i = 0; i < $scope.connectedUsers.length; i++) {
                const item = $scope.connectedUsers[i];
                if (item.id === user.id) {
                    $scope.$apply(() => {
                        $scope.connectedUsers.splice(i, 1);
                    });
                    return;
                }
            }
        }

        /**
         * Updates a user in the connected list
         * @param   {Object} user A user Object
         */
        function userUpdated (user) {
            console.log('user updated', user);
            for (let i = 0; i < $scope.connectedUsers.length; i++) {
                const item = $scope.connectedUsers[i];
                if (item.id === user.id) {
                    addMessage(user, `${$scope.connectedUsers[i].name} changed name to ${user.name}`, 'room');
                    $scope.$apply(() => {
                        $scope.connectedUsers[i] = user;
                    });
                    return;
                }
            }
        }

        /**
         * Handles connecting to chat and getting initial data
         * @param   {Object} data Initial chat data
         */
        function chatConnected (data) {
            console.log('connected', data);
            // $scope.messages = data.messages = [];
            $scope.$apply(() => {
                $scope.connectedUsers = data.users;
                $scope.me = $room.getUser();
            });
        }
        $scope.sendMessage = function () {
            if (!$scope.newMessage) {
                return false;
            }
            $room.getSocket()
                .emit('chat.newmessage', $scope.newMessage);
            $scope.newMessage = '';
            scrollToBottomOfChat();
            return false;
        };
        $scope.changeName = function (ev) {
            const confirm = $mdDialog.prompt()
                 .title('What would you name to be')
                 .textContent('By default you will be named after a random Planeswalker.')
                 .clickOutsideToClose(true)
                 .placeholder('Input name')
                 .ariaLabel('Input name')
                 .targetEvent(ev)
                 .ok('UPdate Name')
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
        $scope.getUsername = function (user) {
            for (let i = 0; i < $scope.connectedUsers.length; i++) {
                if ($scope.connectedUsers[i].id === user.id) {
                    return $scope.connectedUsers[i].name;
                }
            }
            return user.name;
        };

        function connectChat () {
            const socket = $room.getSocket();
            socket.on('chat.message', recieveMessage);
            socket.on('chat.card', recieveCard);
            socket.on('chat.raptorize', raptorize);
            socket.on('chat.user.connected', userConnected);
            socket.on('chat.user.disconnected', userDisconnected);
            socket.on('chat.user.updated', userUpdated);
            socket.on('chat.connected', chatConnected);
        }

        connectChat();
    }]);
}());
