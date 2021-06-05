const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    maxLength: 20,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  cart: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
    },
  ],
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isUsernameTaken = async function (username) {
  const user = this;
  const myUser = await user.findOne({ username });
  if (myUser) {
    throw new Error('Tên người dùng đã được sử dụng.');
  }
  // trả về false
  return !!myUser;
};

userSchema.methods.isPassWordMatch = async function (password) {
  const user = this;
  const passWordMatch = await bcrypt.compare(password, user.password);
  return passWordMatch;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
