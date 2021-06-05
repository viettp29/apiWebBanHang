const express = require('express');
const { queryUsers } = require('../../controllers/user.controller');

const router = express.Router();

router.get('/all-users', async (req, resx) => {
  try {
    const users = await queryUsers();
    return res.json(users);
  } catch (e) {
    res.json({
      err: e.message,
    });
  }
});

module.exports = router;
