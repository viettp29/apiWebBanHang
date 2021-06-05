const Product = require('../models/product.model');

const createProduct = async (productBody) =>{
  if (await Product.isNameTaken(productBody.name)) {
    throw new Error('Sản phẩm đã có sẵn.')
  }
    const product = await Product.create(productBody);
    return product;
}

const queryProduct = async () => {
  const product = await Product.find({});
  return  product;
}

const getProductById = async (productId) => {

  const product = await Product.findById(productId);
  if (product) {
    return product;
  }
  throw new Error('Sản phẩm không tồn tại.')
};

const updateProduct = async (updateBody) => {
  const product = await Product.findOne(updateBody._id);
  if (!product) {
    throw new Error('Sản phẩm bạn chỉnh sửa không đúng.');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await Product.findOne(productId);
  if (product) {
    return Product.deleteOne(productId);
  }
  throw new Error('Sản phẩm không tồn tại.');
};

module.exports = {
  createProduct,
  queryProduct,
  updateProduct,
  deleteProductById,
  getProductById
};
