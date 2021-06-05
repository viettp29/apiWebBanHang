const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    // required: true,
  },
  description: {
    type: String,
    maxLength: 1000,
  },
});

productSchema.plugin(toJSON);

productSchema.statics.isNameTaken = async function (name) {
  const product = this;
  const myProduct = await product.findOne({ name });
  if (myProduct) {
    throw new Error('Sản phẩm đã có sẵn.');
  }
  // trả về true
  return !!myProduct;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
