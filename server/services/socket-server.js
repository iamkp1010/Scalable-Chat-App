const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const { Server } = require('socket.io');
const { produceMessage } = require('./kafka');
require('dotenv').config();

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

const socketServer = (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
  });

  socket.on('join room', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => {
    pub.publish('TYPING', JSON.stringify({ room, socketId: socket.id }));
  });

  socket.on('stop typing', (room) => {
    pub.publish('STOP_TYPING', JSON.stringify({ room, socketId: socket.id }));
  });

  socket.on('new message', (newMessageRecieve) => {
    const chat = newMessageRecieve.chatId;
    pub.publish(
      'MESSAGES',
      JSON.stringify({
        room: chat?._id,
        newMessageRecieve,
        socketId: socket.id,
      })
    );
  });
};

const startSocketServer = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    sub.subscribe('MESSAGES');
    sub.subscribe('TYPING');
    sub.subscribe('STOP_TYPING');
    socketServer(socket);
  });

  sub.on('message', async (channel, message) => {
    const parsedMessage = JSON.parse(message);
    switch (channel) {
      case 'MESSAGES':
        io.to(parsedMessage.room)
          .except(parsedMessage.socketId)
          .emit('message recieved', parsedMessage.newMessageRecieve);

        await produceMessage(
          parsedMessage.newMessageRecieve,
          io,
          parsedMessage.socketId
        );

        break;
      case 'TYPING':
        io.to(parsedMessage.room).except(parsedMessage.socketId).emit('typing');
        break;
      case 'STOP_TYPING':
        io.to(parsedMessage.room)
          .except(parsedMessage.socketId)
          .emit('stop typing');
        break;
    }
  });
};

module.exports = { startSocketServer };
