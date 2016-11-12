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

// Matt is mean
const usernames = ['Mike', 'Damian', 'Sean', 'Lauren'];

let users = 0;

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// Static serving
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
// Load REST APIs
require('./rest/index')(app);
// Home Page
app.use(/^\/$/, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Deck page as default
app.use(/^\/[a-zA-Z0-9\-_]*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/deck.html'));
});
server.listen(app.get('port'), () => {
    mongoose.connect('mongodb://192.168.0.17:27017/deckitron');
    console.log('Node app is running at localhost:' + app.get('port'));
});

io.on('connection', (socket) => {
    const user = {
        id: users++
    };
    console.log(`user connected ${user.id}`);
    user.name = usernames[user.id % usernames.length];

    socket.emit('connected', user);

    socket.on('room.join', (roomName) => {
        socket.join(roomName);
        chat(io, socket, roomName, user);
        deck(io, socket, roomName, user);
        console.log(`User ${user.id} joined ${roomName}`);
    });
});
