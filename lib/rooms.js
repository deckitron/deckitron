'use strict';

const rooms = {};

function openRoom (roomName) {
    rooms[roomName] = {
        users: []
    };
}
function closeRoom (roomName) {
    rooms[roomName] = null;
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
}
function removeUserFromRoom (roomName, user) {
    const room = getRoomDetails(roomName);
    const users = room.users;
    for (let i = 0; i < users.length; i++) {
        if (user.id === users[i].id) {
            users.splice(i, 1);
            break;
        }
    }
    if (users.length < 1) {
        closeRoom(roomName);
    }
}
function getRoomsList () {
    const list = [];
    for (let i in rooms) {
        if (rooms.hasOwnProperty(i)) {
            list.push({
                name: i,
                users: rooms[i].users.length
            });
        }
    }
    return list;
}

module.exports = {
    openRoom,
    closeRoom,
    getRoomDetails,
    addUserToRoom,
    removeUserFromRoom,
    getRoomsList
};
