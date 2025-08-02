const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    socket.roomCode = roomCode;
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });

  socket.on('offer', ({ offer, roomCode }) => {
    socket.to(roomCode).emit('offer', offer);
  });

  socket.on('answer', ({ answer, roomCode }) => {
    socket.to(roomCode).emit('answer', answer);
  });

  socket.on('ice-candidate', ({ candidate, roomCode }) => {
    socket.to(roomCode).emit('ice-candidate', candidate);
  });
});

server.listen(10000, () => {
  console.log('Signaling server is running on port 10000');
});
