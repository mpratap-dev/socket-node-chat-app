const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { joinUser, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000 || process.env.PORT;
const BOT_NAME = 'Chatty';

// * Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// * Run when client is connected
io.on('connection', (socket) => {
  console.log('New ws connection...');
  socket.on('joinRoom', ({ username, room }) => {
    const user = joinUser({ id: socket.id, username, room });
    socket.join(user.room);
    socket.emit('message', formatMessage(BOT_NAME, 'Welcome to ChatCord'));
    io.to(room).emit('roomUsers', {
      users: getRoomUsers(room), room
    });
    socket.broadcast.to(user.room).emit('message', formatMessage(BOT_NAME, `${user.username} joined the chat`));
  });

  socket.on('chatMessage', (message) => {
    const { username, room } = getCurrentUser(socket.id);
    io.to(room).emit('message', formatMessage(username, message));
  });

  socket.on('disconnect', () => {
    const { room, username } = userLeaves(socket.id);

    if(room) {
      io.to(room).emit('roomUsers', {
        users: getRoomUsers(room), room
      });
      io.to(room).emit('message', formatMessage(BOT_NAME, `${username} has left the chat`));
    }
  });
});

server.listen(PORT, () => {
  console.log('Server running on: ', PORT);
})