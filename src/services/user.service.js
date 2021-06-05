const User = require('../models/user.model');

const queryUsers = async () => {
  const users = await User.find({});
  return users;
};

const getUserByUserName = async (username) => {
  return User.findOne({ username });
};

module.exports = {
  queryUsers,
  getUserByUserName,
};
