const express = require('express');
const userRoutes = require('./user.router.js');
const chatRoutes = require('./chat.router.js');
const messageRoutes = require('./message.router.js');
const authRoutes = require('./auth.router.js');

const router = express.Router();

router.use('/', userRoutes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/message', messageRoutes);

module.exports = router;
