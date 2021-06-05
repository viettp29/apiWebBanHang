const {generateAuthTokens, verifyToken} = require('../services/token.service')
const User = require('../models/user.model')

const checkToken = async (req, res, next) => {
try {
  const token = req.headers.authorization;
  const isVerifyToken = await verifyToken(token);
  if (!isVerifyToken) {
    return res.json('Token fake')
  }
  const infoUser = await User.findById({ _id: isVerifyToken.sub })
  req.userInfo = infoUser;
  next()
} catch (e) {
  return res.json({
    err: e.message,
  })
}
}

module.exports = checkToken;
