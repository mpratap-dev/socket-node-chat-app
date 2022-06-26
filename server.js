const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./socketHandler')(io);

const PORT = 3000 || process.env.PORT;

// * Set static folder
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
  console.log('Server running on: ', PORT);
})