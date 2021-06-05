const authService = require('../services/auth.service');
const { generateAuthTokens, generateToken } = require('../services/token.service');
const bcrypt = require('bcryptjs')

const createAdmin = async (userBody) => {
  const user = await authService.createAdmin(userBody);
  return user;
};

const loginUser = async (username, password) => {
  // lấy ra tk mk của người dùng lưu vào biến user
  const user = await authService.getUserByUserName(username);
    if (!user) {
    throw new Error('Tài khoản bạn nhập chưa đúng.')
  }
  // sau đó so sánh mk nhập vào và mật khẩu có trong DB.
 const isPasswordMatch = await bcrypt.compare(password, user.password);
 if (isPasswordMatch) {
   const tokens = await generateToken(user._id);
   return ({ tokens })
 }
  throw new Error('Mật khẩu của bạn không đúng.')
  }

module.exports = {
  createAdmin,
  loginUser,
};
