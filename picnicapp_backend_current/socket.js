const http = require('http');
const env = require('./env');

const socketConf = require('./app/release/v1/socket/app.socket.bundler');
const socketPort = process.env.SOCKET_PORT || env.SOCKET_PORT;

const socketServer = http.createServer();

var io = require('socket.io')(socketServer);

socketConf.bundler(io);

io.attach(socketPort, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});