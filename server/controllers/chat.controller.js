const ChatModel = require('../models/chat.model.js');
const UserModel = require('../models/user.model.js');

const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.send({ message: 'Provide User Id' });

  let chatExists = await ChatModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.rootUserId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  chatExists = await UserModel.populate(chatExists, {
    path: 'latestMessage.sender',
    select: 'name email profilePic',
  });

  if (chatExists.length > 0) return res.status(200).send(chatExists[0]);

  const data = {
    chatName: 'sender',
    users: [userId, req.rootUserId],
    isGroup: false,
  };

  try {
    const newChat = await ChatModel.create(data);
    const chat = await ChatModel.find({ _id: newChat._id }).populate(
      'users',
      '-password'
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const fetchAllChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      users: { $elemMatch: { $eq: req.rootUserId } },
    })
      .populate('users')
      .populate('latestMessage')
      .populate('groupAdmin')
      .sort({ updatedAt: -1 });
    const finalChats = await UserModel.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name email profilePic',
    });
    res.status(200).json(finalChats);
  } catch (error) {
    res.status(500).send({ error: error });
    console.log(error);
  }
};

const creatGroup = async (req, res) => {
  const { chatName, users } = req.body;
  if (!chatName || !users)
    return res.status(400).json({ message: 'Please fill the fields' });

  const parsedUsers = JSON.parse(users);
  if (parsedUsers.length < 2)
    return res.status(400).send('Group should contain more than 2 users');

  parsedUsers.push(req.rootUser);
  try {
    const chat = await ChatModel.create({
      chatName: chatName,
      users: parsedUsers,
      isGroup: true,
      groupAdmin: req.rootUserId,
    });
    const createdChat = await ChatModel.findOne({ _id: chat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).json(createdChat);
  } catch (error) {
    res.sendStatus(500);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName)
    return res.status(400).send('Provide chat id and chat name');

  try {
    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      $set: { chatName },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    if (!chat) return res.status(404).send('Chat not found');
    res.status(200).send(chat);
  } catch (error) {
    res.status(500).send({ error: error });
    console.log(error);
  }
};

const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const existing = await ChatModel.findOne({ _id: chatId });
  if (!existing.users.includes(userId)) {
    try {
      const chat = await ChatModel.findByIdAndUpdate(chatId, {
        $push: { users: userId },
      })
        .populate('groupAdmin', '-password')
        .populate('users', '-password');
      if (!chat) return res.status(404).send('Chat not found');
      res.status(200).send(chat);
    } catch (error) {
      res.status(500).send({ error: error });
    }
  } else {
    res.status(409).send('User already exists');
  }
};

const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const existing = await ChatModel.findOne({ _id: chatId });
  if (existing.users.includes(userId)) {
    try {
      const chat = await ChatModel.findByIdAndUpdate(chatId, {
        $pull: { users: userId },
      })
        .populate('groupAdmin', '-password')
        .populate('users', '-password');
      res.status(200).send(chat);
    } catch (error) {
      res.status(404).send({ error: error });
    }
  } else {
    res.status(409).send('User doesnt exist');
  }
};

module.exports = {
  accessChats,
  fetchAllChats,
  creatGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
