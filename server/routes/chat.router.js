const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware.js');
const {
  accessChats,
  fetchAllChats,
  creatGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chat.controller.js');

const router = express.Router();

router.post('/', verifyToken, accessChats);
router.get('/', verifyToken, fetchAllChats);
router.post('/group', verifyToken, creatGroup);
router.patch('/group/rename', verifyToken, renameGroup);
router.patch('/groupAdd', verifyToken, addToGroup);
router.patch('/groupRemove', verifyToken, removeFromGroup);
router.delete('/removeuser', verifyToken);

module.exports = router;
