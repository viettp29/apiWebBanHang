const userService = require('../services/user.service');

const queryUsers = async () => {
  const users = await userService.queryUsers();
  return users;
};

module.exports = {
  queryUsers,
};
