const Message = require('../models/message.model.js');
const ChatModel = require('../models/chat.model.js');

const sendMessage = async (req) => {
  const { chatId, message } = req;
  try {
    let msg = await Message.create({ sender: req.sender._id, message, chatId });
    msg = await (
      await msg.populate('sender', 'name profilePic email')
    ).populate({
      path: 'chatId',
      select: 'chatName isGroup users',
      model: 'Chat',
      populate: {
        path: 'users',
        select: 'name email profilePic',
        model: 'User',
      },
    });
    await ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
