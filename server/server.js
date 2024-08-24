const http = require('http');
const { startSocketServer } = require('./services/socket-server.js');
require('dotenv').config();
const app = require('./app.js');
const { mongoConnect } = require('./services/mongo.js');
const { startMessageConsumer } = require('./services/kafka.js');

const PORT = process.env.PORT || 7000;
const server = http.createServer(app);

async function startServer() {
  try {
    await mongoConnect();
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
    startSocketServer(server);
    startMessageConsumer();
  } catch (err) {
    console.error('Server error: (mongo/ socket/ kafka)', err);
  }
}

startServer();
