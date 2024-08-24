const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apis = require('./routes/apis.js');
const cookieParser = require('cookie-parser');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apis);

module.exports = app;
