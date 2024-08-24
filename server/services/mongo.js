const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

mongoose.set('strictQuery', true);

async function mongoConnect() {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error('MongoDB connection error: ', err);
  }
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
