const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('./index');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */

/*
Để tạo ra 1 Token thì cần  các thuộc tính sau:
 thời hạn truy cập của token tính bằng phút
 payload {
 sub : token của ai. truyền userId vào.
 iat : thời gian tạo ra moment.
 exp : truyền cái thời hạn truy cập vào.
 }
 sau đó return jwt.sign(payload, secret)
*/
// const generateToken = (userId, expires, types, secret = config.jwt.secret) => {
//   const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//   const payload = {
//     sub: userId,
//     iat: moment().unix(),
//     exp: accessTokenExpires.minutes(),
//   };
//   return jwt.sign(payload, secret);
// };

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: accessTokenExpires.unix()
  }
  return jwt.sign(payload, secret);
}

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} types
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
// const saveToken = async (token, userId, expires, types, blacklisted = false) => {
//   const tokenDoc = await Token.create({
//     token,
//     user: userId,
//     expires: expires.toDate(),
//     type,
//     blacklisted,
//   });
//   return tokenDoc;
// };

const saveToken = async (token, userId, expires, types, blacklisted = false) => {
  const docsToken = await Token.create({
    token,
    userId,
    expires,
    types,
    blacklisted,
  })
  return docsToken;
}

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Promise<Token>}
 */
// const verifyToken = async token => {
//   const payload = jwt.verify(token, config.jwt.secret);
//   const tokenDoc = await Token.findOne({ token, user: payload.sub, types, blacklisted: false });
//   if (!tokenDoc) {
//     throw new Error('Token not found');
//   }
//   return tokenDoc;
// };

const verifyToken = async token => {
  // lấy ra payload với jwt.verify sau đó kiểm tra trong db có token chứa các thông tin trong payload k
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    return payload;
  } catch (e) {
    throw new Error("TOKEN FAKE")
  }
}


// const generateAuthTokens = async (user) => {
//   const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//   const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
//
//   const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
//   const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
//   await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
//
//   return {
//     access: {
//       token: accessToken,
//       expires: accessTokenExpires.toDate(),
//     },
//     refresh: {
//       token: refreshToken,
//       expires: refreshTokenExpires.toDate(),
//     },
//   };
// };

const generateAuthTokens = async (userId, expires, types, secret = config.jwt.secret) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = await generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = await generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  }
}

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async ( username ) => {
  const user = await userService.getUserByUserName(username);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this username');
  }
  // tạo mã hết hạn
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  // tạo token reset mật khẩu mới
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  // lưu lại vào DB và trả về
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
};
