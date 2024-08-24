const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../controllers/message.controller');
require('dotenv').config();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_URL],
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf-8')],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: 'plain',
  },
});

let producer = null;

async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

let io;
let socket_id;
async function produceMessage(message, socket_io, socketId) {
  io = socket_io;
  socket_id = socketId;
  const producer = await createProducer();
  await producer.send({
    messages: [
      { key: `message-${Date.now()}`, value: JSON.stringify(message) },
    ],
    topic: 'MESSAGES',
  });
  return true;
}

async function startMessageConsumer() {
  try {
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();
    console.log('Consumer is running..');
    await consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true });

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ message, pause }) => {
        if (!message.value) return;
        console.log(`New Message Recv..`);
        try {
          await sendMessage(JSON.parse(message.value));
          io.to(socket_id).emit('message saved');
        } catch (err) {
          console.log(err);
          console.log('Something is wrong');
          pause();
          setTimeout(() => {
            consumer.resume([{ topic: 'MESSAGES' }]);
          }, 60 * 1000);
        }
      },
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  kafka,
  createProducer,
  produceMessage,
  startMessageConsumer,
};
