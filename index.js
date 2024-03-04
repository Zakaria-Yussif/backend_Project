const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
const express = require('express');
const app = express();






erver.listen(9000, () => {
    console.log('listening on *:3000');
  });