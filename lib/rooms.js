'use strict';

const EventEmitter = require('events');
const swearjar = require('swearjar');

const roomEmitter = new EventEmitter();
const rooms = {};

function openRoom (roomName) {
    rooms[roomName] = new EventEmitter();
    rooms[roomName].users = [];
    roomEmitter.emit('changed');
}
function closeRoom (roomName) {
    rooms[roomName].emit('closed');
    rooms[roomName] = null;
    roomEmitter.emit('changed');
}
function getRoomDetails (roomName) {
    if (!rooms[roomName]) {
        openRoom(roomName);
    }
    return rooms[roomName];
}
function addUserToRoom (roomName, user) {
    const room = getRoomDetails(roomName);
    room.users.push(user);
    room.emit('userAdded', user);
    roomEmitter.emit('changed');
}
function removeUserFromRoom (roomName, user) {
    const room = getRoomDetails(roomName);
    const users = room.users;
    for (let i = 0; i < users.length; i++) {
        if (user.id === users[i].id) {
            users.splice(i, 1);
            room.emit('userRemoved', user);
            break;
        }
    }
    if (users.length < 1) {
        closeRoom(roomName);
    }
    roomEmitter.emit('changed');
}
function getRoomsList () {
    const list = [];
    for (let i in rooms) {
        if (rooms.hasOwnProperty(i) && rooms[i] && !swearjar.profane(i)) {
            list.push({
                name: i,
                url: i,
                users: rooms[i].users.length
            });
        }
    }
    return list;
}

roomEmitter.openRoom = openRoom;
roomEmitter.closeRoom = closeRoom;
roomEmitter.getRoomDetails = getRoomDetails;
roomEmitter.addUserToRoom = addUserToRoom;
roomEmitter.removeUserFromRoom = removeUserFromRoom;
roomEmitter.getRoomsList = getRoomsList;

module.exports = roomEmitter;
