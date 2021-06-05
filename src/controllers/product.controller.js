const productService = require('../services/product.service');

const createProduct = async (productBody) => {
  const product = await productService.createProduct(productBody);
  return (product);
};

const queryProduct = async (req, res) => {
  const products = await productService.queryProduct();
  return products;
};

const getProductById = async (productId) => {
  const product = await productService.getProductById(productId);
  return product;
};

const deleteProduct = async (req, res) => {
  const deleted = await productService.deleteProductById(req.params._id);
  return deleted;
};

const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.body);
  return product;
};

module.exports = {
  createProduct,
  queryProduct,
  getProductById,
  deleteProduct,
  updateProduct,
};
