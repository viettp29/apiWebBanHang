let mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect('mongodb://localhost/testMongoDB', options);


const inventorySchema = new mongoose.Schema({
  item: {
    type: String,
  },
  qty: {
    type: Number,
  },
  tags: [{
    type: String,
  }],
  size: {
    h: {
      type: Number,
    },
    w: {
      type: Number,
    },
    uom: {
      type: String,
    }
  }
})
const Inventory = mongoose.model('Inventory', inventorySchema);


const productSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
})
const Product = mongoose.model('Product', productSchema);

let find = await Product.find({ sku: { $regex: /789$/ } })
console.log(find);
