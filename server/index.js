const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const Worker = require('./src/worker');

const PORT = 8080;

let rooms = [];
const players = {};
const workers = {};
const workerStateSubscriptions = {};

app.use(cors());

// Validation
io.use((socket, next) => {
    console.log('Connection incoming...');

    const playerId = socket.handshake.query.playerId;
    if (!playerId || playerId === '' || playerId === 'undefined' ||
        (players[playerId] && players[playerId].online)) {

        console.log('Connection failure');
        return;
    }

    if (players[playerId]) {
        players[playerId].online = true;
        console.log('Reconnection ', playerId);
    } else {
        players[playerId] = { room: null, online: true };
        console.log('Connection ', playerId);
    }

    next();
});

io.on('connection', (socket) => {
    const playerId = socket.handshake.query.playerId;

    const roomFeed = (function () {
        if (players[playerId].room) {
            // rejoin room
            socket.join([players[playerId].room]);
            const room = rooms.find((room) => room.name === players[playerId].room);
            room.playersOnline += 1;

            return null;
        }
        return setInterval(() => {
            const availableRooms = rooms
                .filter((room) => room.players.length === 1)
                .map((room) => room.name);
            socket.emit('roomList', { availableRooms });
        }, 1000);
    })();

    socket.on('createRoom', ({ roomName }) => {
        if (rooms.find((room) => room.name === roomName)) {
            socket.emit('err', { err: 'Name taken' });
            return;
        }

        if (players[playerId].room) {
            socket.emit('err', { err: 'Already in room' });
            return;
        }

        socket.join(roomName);
        rooms.push({ name: roomName, playersOnline: 1, players: [playerId] });
        players[playerId].room = roomName;
        clearInterval(roomFeed);
        console.log('created room: ', roomName);
    });

    socket.on('joinRoom', ({ roomName }) => {
        const room = rooms.find((room) => room.name === roomName);
        if (!players[playerId].room && room && room.players.length === 1) {
            socket.join(roomName);
            room.playersOnline += 1;
            room.players.push(playerId);
            players[playerId].room = roomName;
            clearInterval(roomFeed);

            socket.emit('ready');
            socket.to(roomName).emit('p2Join');

            workers[room.name] = new Worker();
            workerStateSubscriptions[room.name] = workers[room.name].output.subscribe((data) => {
                io.in(room.name).emit('message', { message: data[0].msg });
            });
        }
    });

    socket.on('stateChange', ({ message }) => {
        const roomName = players[playerId].room;
        if (workers[roomName]) {
            workers[roomName].sendMsg(message);
        }
    });

    socket.on('message', ({ message }) => {
        const roomName = players[playerId].room;
        if (!roomName) {
            return;
        }

        socket.to(roomName).send({ message });
    });

    socket.on('disconnect', () => {
        console.log('Disconnected ', playerId);
        players[playerId].online = false;
        const room = rooms.find((room) => room.name === players[playerId].room);

        if (room) {
            room.playersOnline -= 1;
            if (!room.playersOnline) {
                rooms = rooms.filter((roomIter) => roomIter.name !== room.name);
                room.players.forEach((player) => {
                    players[player] = undefined;
                });

                workers[room.name].kill();
                workerStateSubscriptions[room.name].unsubscribe();

                console.log(`Room ${room.name} destroyed`);
            }
        }

        if (roomFeed) {
            clearInterval(roomFeed);
        }
    });
});

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));