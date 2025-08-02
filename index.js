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
  console.log(`[CONNECT] User connected: ${socket.id}`);

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    socket.roomCode = roomCode;
    console.log(`[ROOM] User ${socket.id} joined room ${roomCode}`);
    console.log(`[ROOM] Current rooms for ${socket.id}:`, Array.from(socket.rooms));
    // Notify others in the room that a new user joined
    socket.to(roomCode).emit('user-joined', { roomCode });
  });

  socket.on('offer', ({ offer, roomCode }) => {
    console.log(`[SIGNAL] Offer from ${socket.id} to room ${roomCode}`);
    console.log(`[SIGNAL] Offer payload:`, offer);
    socket.to(roomCode).emit('offer', offer);
    console.log(`[SIGNAL] Offer emitted to room ${roomCode}`);
  });

  socket.on('answer', ({ answer, roomCode }) => {
    console.log(`[SIGNAL] Answer from ${socket.id} to room ${roomCode}`);
    console.log(`[SIGNAL] Answer payload:`, answer);
    socket.to(roomCode).emit('answer', answer);
    console.log(`[SIGNAL] Answer emitted to room ${roomCode}`);
  });

  socket.on('ice-candidate', ({ candidate, roomCode }) => {
    console.log(`[SIGNAL] ICE candidate from ${socket.id} to room ${roomCode}`);
    console.log(`[SIGNAL] ICE candidate payload:`, candidate);
    socket.to(roomCode).emit('ice-candidate', candidate);
    console.log(`[SIGNAL] ICE candidate emitted to room ${roomCode}`);
  });

  socket.on('joiner-ready', ({ roomCode }) => {
    console.log(`[SIGNAL] Joiner ready notification from ${socket.id} to room ${roomCode}`);
    socket.to(roomCode).emit('joiner-ready');
    console.log(`[SIGNAL] Joiner ready notification emitted to room ${roomCode}`);
  });
});

server.listen(10000, () => {
  console.log('[SERVER] Signaling server is running on port 10000');
});
