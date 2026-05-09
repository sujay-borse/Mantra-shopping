const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String, brand: String, image: String,
    price:    Number, quantity: Number, size: String,
  }],
  address: {
    name: String, phone: String, line1: String,
    city: String, state: String, pincode: String,
  },
  paymentMethod: { type: String },
  paymentId:     { type: String },
  coupon:        { type: String },
  subtotal:      { type: Number },
  discount:      { type: Number, default: 0 },
  deliveryFee:   { type: Number, default: 0 },
  total:         { type: Number },
  status:        { type: String, enum: ['Pending','Processing','Shipped','Delivered','Cancelled','Returned'], default: 'Processing' },
  trackingId:    { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt:   { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
