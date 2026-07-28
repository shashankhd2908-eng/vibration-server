const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// This sets up the real-time connection and allows your app to talk to it
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// This is the logic for when a phone connects to the server
io.on('connection', (socket) => {
  console.log('A phone connected:', socket.id);

  // 1. Phone asks to join a specific 4-digit room
  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`Phone ${socket.id} joined room ${roomCode}`);
  });

  // 2. Phone presses the giant "Vibrate" button
  socket.on('trigger_vibration', (roomCode) => {
    console.log(`Sending vibration command to room ${roomCode}`);
    
    // Broadcast the command to the OTHER phone in the room
    socket.to(roomCode).emit('vibrate_command');
  });

  // Phone disconnects (closes the app)
  socket.on('disconnect', () => {
    console.log('A phone disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running perfectly on port ${PORT}`);
});