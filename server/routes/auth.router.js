const express = require('express');
const {
  register,
  login,
  validUser,
  googleAuth,
  logout,
} = require('../controllers/user.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { refresh } = require('../controllers/token.controller.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/valid', verifyToken, validUser);
router.post('/logout', verifyToken, logout);
router.post('/google', googleAuth);
router.post('/tokenRefresh', refresh)

module.exports = router;
