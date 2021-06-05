const express = require('express');
const router = express.Router();
const checkToken = require('../../middlewares/checkToken');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');

router.get('/', checkToken, async (req, res) => {
  try {
    const { userInfo } = req;
    return res.json(userInfo.cart)
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})
router.post('/add-to-cart', checkToken, async (req, res) => {
  try {
    const { userInfo } = req;
    let {product} = req.body;
    let isValidProduct = await Product.findOne({_id: product})
    if (isValidProduct) {
      let user = await User.updateOne({
        _id: userInfo._id
      }, {
        $push: {cart: product}
      })
      return res.json(user)
    } else {
      throw new Error("Product not found")
    }
    return res.json(userInfo.cart)
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})
router.delete('/remove-from-cart', checkToken, async (req, res) => {
  try {
    const { userInfo } = req;
    let {product} = req.body;
    let isValidProduct = await Product.findOne({_id: product})
    if (isValidProduct) {
      let userUpdated = await User.updateOne(
        {
          _id: userInfo._id
        }, {
          $pull: { cart: product }
        }
      )
      let users = await User.findOne({_id: userInfo._id});
      return res.json(users)
      // userInfo.cart.push(product);
      // await userInfo.save()
      // return res.json(userInfo)
    } else {
      throw new Error("Product not found")
    }
    return res.json(userInfo.cart)
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})
module.exports = router;
