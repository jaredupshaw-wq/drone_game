// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
    console.log('Player joined:', socket.id);
    
    // Initialize new player
    players[socket.id] = {
        x: 0, y: 0, z: 0,
        rx: 0, ry: 0, rz: 0,
        id: socket.id,
        hp: 100
    };

    // Send current players to the new user
    socket.emit('current_players', players);

    // Broadcast new player to everyone
    socket.broadcast.emit('new_player', players[socket.id]);

    // Handle movement updates
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].z = data.z;
            players[socket.id].rx = data.rx;
            players[socket.id].ry = data.ry;
            players[socket.id].rz = data.rz;
            io.emit('player_moved', players[socket.id]);
        }
    });

    // Handle shooting
    socket.on('shoot', (data) => {
        io.emit('bullet_fired', { id: socket.id, pos: data.pos, dir: data.dir });
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('player_left', socket.id);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));