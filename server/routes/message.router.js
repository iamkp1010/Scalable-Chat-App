const express = require('express');
const {
  sendMessage,
  getMessages,
} = require('../controllers/message.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');

const router = express.Router();
router.post('/', verifyToken, sendMessage);
router.get('/:chatId', verifyToken, getMessages);

module.exports = router;
