const UserModel = require('../models/user.model.js');
const { OAuth2Client } = require('google-auth-library');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('./token.controller.js');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const getUserInfo = async (code) => {
  try {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket['payload'];
  } catch (error) {
    console.log(error);
  }
};

const googleAuth = async (req, res) => {
  try {
    if (!req.body?.code) throw new Error('Code is not attached!');
    const code = req.body.code;
    const { email, picture, given_name, family_name } = await getUserInfo(code);

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        email,
        name: given_name + ' ' + family_name,
        profilePic: picture,
        thirdPartyLogin: true,
      });
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    const accessCookieExpire = new Date();
    accessCookieExpire.setTime(accessCookieExpire.getTime() + 60 * 60 * 1000);
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expires: accessCookieExpire,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        path: '/api/auth/tokenRefresh',
      })
      .json({ message: 'Success' });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already Exits' });

    const fullname = firstname + ' ' + lastname;
    const newuser = await UserModel.create({ email, password, name: fullname });

    const accessToken = await generateAccessToken(newuser);
    const refreshToken = await generateRefreshToken(newuser);

    const accessCookieExpire = new Date();
    accessCookieExpire.setTime(accessCookieExpire.getTime() + 60 * 60 * 1000);
    newuser.refreshToken = refreshToken;
    await newuser.save();

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expires: accessCookieExpire,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        path: '/api/auth/tokenRefresh',
      })
      .json({ message: 'success' });
  } catch (error) {
    console.log('Error in register ' + error);
    res.status(500).send({ error: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const valid = await UserModel.findOne({ email });
    if (!valid) throw new Error('User not found, Please register!');
    if (valid?.thirdPartyLogin)
      res
        .status(400)
        .json({ message: 'User not found, You have registered using Google!' });

    const validPassword = await valid.isPasswordCorrect(password);
    if (!validPassword)
      res.status(400).json({ message: 'Invalid Credentials' });

    const accessToken = await generateAccessToken(valid);
    const refreshToken = await generateRefreshToken(valid);

    const accessCookieExpire = new Date();
    accessCookieExpire.setTime(accessCookieExpire.getTime() + 60 * 60 * 1000);
    valid.refreshToken = refreshToken;
    await valid.save();

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expires: accessCookieExpire,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        path: '/api/auth/tokenRefresh',
      })
      .json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const validUser = async (req, res) => {
  try {
    const validuser = await UserModel.findOne({ _id: req.rootUserId }).select(
      '-password'
    );
    if (!validuser) res.status(400).json({ message: 'User is not valid' });
    res.status(201).json({ user: validuser });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

const logout = async (req, res) => {
  const user = req.rootUserId;
  await UserModel.findByIdAndUpdate(
    user,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  return res
    .status(200)
    .clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      path: '/api/auth/tokenRefresh',
    })
    .json({ message: 'User logged out' });
};

const searchUsers = async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await UserModel.find(search).find({
    _id: { $ne: req.rootUserId },
  });
  res.status(200).send(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedUser = await UserModel.findOne({ _id: id }).select(
      '-password'
    );
    res.status(200).json(selectedUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { bio, name } = req.body;
  const updatedUser = await UserModel.findByIdAndUpdate(id, { name, bio });
  return updatedUser;
};

module.exports = {
  googleAuth,
  register,
  login,
  validUser,
  logout,
  searchUsers,
  getUserById,
  updateInfo,
};
