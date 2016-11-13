'use strict';

const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const chat = require('./lib/chat');
const deck = require('./lib/deck');
const rooms = require('./lib/rooms');

// Matt is mean
const usernames = [
    'Jace',
    'Garruk',
    'Nissa',
    'Liliana',
    'Ajani',
    'Chandra',
    'Gideon',
    'Kiora',
    'Nixilis',
    'Elspeth',
    'Tezzeret',
    'Sarkhan',
    'Bolas',
    'Sorin',
    'Koth',
    'Venser',
    'Karn',
    'Tamiyo',
    'Tibalt',
    'Vraska',
    'Domri',
    'Ral',
    'Ashiok',
    'Xenagos',
    'Dack',
    'Nahiri',
    'Teferi',
    'Daretti',
    'Freyalise',
    'Ugin',
    'Narset',
    'Arlinn',
    'Kaya',
    'Dovin',
    'Saheeli'
];
const colors = [
    'orange',
    'tomato',
    'pink',
    'royalblue',
    'purple',
    'gold',
    'fuchsia',
    'limegreen',
    'sandybrown'
];

let users = 0;

mongoose.Promise = global.Promise;

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// Static serving
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
// Home Page
app.use(/^\/$/, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
// Deck page as default
app.use(/^\/[a-zA-Z0-9\-_]*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/deck.html'));
});
server.listen(app.get('port'), () => {
    if (typeof process.env.MONGO === 'string') {
        mongoose.connect(`mongodb://${process.env.MONGO}/deckitron`);
    } else {
        mongoose.connect('mongodb://localhost/deckitron');
    }
    console.log('Node app is running at localhost:' + app.get('port'));
});
io.on('connection', (socket) => {
    const user = {
        id: users++
    };
    let roomsWatcher = false;
    // console.log(`user connected ${user.id}`);
    user.name = usernames[user.id % usernames.length];
    user.color = colors[user.id % colors.length];

    socket.emit('connected', user);

    socket.on('room.join', (roomName) => {
        socket.join(roomName);
        chat(io, socket, roomName, user);
        deck(io, socket, roomName, user);
        // console.log(`User ${user.id} joined ${roomName}`);
        socket.emit('room.joined');
    });
    socket.on('rooms.getname', () => {
        socket.emit('rooms.name', `${user.color}_${user.name}`);
    });
    socket.on('rooms.watch', () => {
        if (!roomsWatcher) {
            roomsWatcher = () => {
                socket.emit('rooms.list', rooms.getRoomsList());
            };
            rooms.on('changed', roomsWatcher);
        }
        socket.emit('rooms.list', rooms.getRoomsList());
    });
    socket.on('rooms.unwatch', () => {
        if (roomsWatcher) {
            rooms.removeListener('changed', roomsWatcher);
        }
    });
    socket.on('disconnect', () => {
        if (roomsWatcher) {
            rooms.removeListener('changed', roomsWatcher);
        }
    });
});
