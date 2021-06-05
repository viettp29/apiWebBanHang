const User = require('../models/user.model');

const createAdmin = async (userBody) => {
  if (await User.isUsernameTaken(userBody.username)) {
    throw new Error('Tài khoản đã được sử dụng.');
  }
  const user = await User.create(userBody);
  return user;
};

const getUserByUserName = async (username) => {
  const user = await User.findOne({ username });
  return user;
};
module.exports = {
  createAdmin,
  getUserByUserName,
};
