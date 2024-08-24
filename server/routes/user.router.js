const express = require('express');
const {
  searchUsers,
  updateInfo,
  getUserById,
} = require('../controllers/user.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get('/user?', searchUsers);
router.get('/users/:id', getUserById);
router.patch('/users/update/:id', verifyToken, updateInfo);

module.exports = router;
