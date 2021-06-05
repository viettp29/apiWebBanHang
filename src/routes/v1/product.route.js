const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, getProductById, deleteProduct } = require('../../controllers/product.controller')
const Product = require('../../models/product.model')
router.post('/', async (req, res) => {
  try {
    const product = await createProduct(req.body);
    return res.json(product);
  } catch (e) {
return res.json({
  err: e.message,
    })
  }
});
router.get('/', async (req, res) => {
  try {
    const product = await Product.find({});
    return res.json(product);
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
});
router.get('/:productId', async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    if (product) {
      return res.json(product);
    }
      throw new Error('Không tìm thấy sản phẩm.')
  } catch (e) {
return res.json({
  err: e.message,
    })
  }
});

router.put('/:productId', async (req, res) => {
  try {
    const updateBody = await updateProduct(req.body._id);
    return res.json(updateBody);
  } catch (e) {
    return res.json({
      err: e.message,
    })
  }
})
router.delete('/:productId', async (req, res) => {
  try {
    return deleteProduct(req.params.productId);
  } catch (e) {
  return res.json({
    err: e.message,
   })
  }
})

module.exports = router;
