
(function () {
    'use strict';

    function sendMessage (socket) {
        const el = document.getElementById('newMessage');
        console.log('send')
        socket.emit('new message', el.value);
        el.value = '';
    }
    function recieveMessage (data) {
        // let user = data.user;
        const message = data.message;
        const chat = document.getElementById('chatMessages');
        const el = document.createElement('div');
        el.innerHTML = message;
        console.log('recieve')
        chat.appendChild(el);
    }


    window.chat = function (socket) {
        socket.on('message', recieveMessage);
        document.getElementById('chat')
            .addEventListener('submit', () => {
                sendMessage(socket);
            }, false);
    };
}());
