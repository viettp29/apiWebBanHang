// const express = require('express');
// const { createAdmin, loginUser } = require('../../controllers/auth.controller');
// const { generateAuthTokens } = require('../../services/token.service');
//
// const router = express.Router();
//
// router.post('/register', async (req, res) => {
//   try {
//     const user = await createAdmin(req.body);
//     const tokens = await generateAuthTokens(user);
//     return res.json({ user, tokens });
//   } catch (e) {
//     return res.json({
//       err: e.message,
//     });
//   }
// });
//
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await loginUser(username, password);
//     return res.json(user);
//   } catch (e) {
//     return res.json({
//       err: e.message,
//     });
//   }
// });
//
// module.exports = router;

const express = require('express');
const router = express.Router();
const { createAdmin, loginUser } = require('../../controllers/auth.controller');
const checkToken = require('../../middlewares/checkToken')
const { generateToken } = require('../../services/token.service')

router.post('/register', async (req, res) => {
  try {
    let user = await createAdmin(req.body);
    const tokens = await generateToken(user.id);
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    return res.json({ user, tokens });
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const login = await loginUser(username, password);
    if (!login) {
      return res.json('tài khoản hoặc mật khẩu không đúng.')
    }
    return res.json(login);
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})

router.get('/me', checkToken, async (req, res) => {
  try {
    const { infoUser } = req;
    return res.json(infoUser);
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})

module.exports = router;


