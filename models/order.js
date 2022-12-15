const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
});

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports.Order = mongoose.model('order', orderSchema);
module.exports.orderSchema = orderSchema;
