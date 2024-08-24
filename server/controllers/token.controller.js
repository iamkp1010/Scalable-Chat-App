const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email, username: user.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { _id: user._id, email: user.email, username: user.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
  return refreshToken;
};

const refresh = async (req, res) => {
  try {
    if (!req.cookies) throw new Error('No cookies in request');
    const incomingRefreshToken = req.cookies['refreshToken'];
    if (!incomingRefreshToken) throw new Error('No refresh token provided.');

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await UserModel.findById(decodedToken?._id);

    if (!user) throw new Error('Invalid refresh token');
    if (incomingRefreshToken !== user?.refreshToken)
      throw new Error('Refresh token is expired or used');

    const accessToken = generateAccessToken(user);
    const accessCookieExpire = new Date();
    accessCookieExpire.setTime(accessCookieExpire.getTime() + 60 * 60 * 1000);

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expires: accessCookieExpire,
      })
      .json({ msg: 'AccessToken is refreshed' });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refresh,
};
