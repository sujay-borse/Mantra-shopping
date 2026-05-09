const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     String,
  rating:   { type: Number, required: true, min: 1, max: 5 },
  title:    String,
  body:     String,
  verified: { type: Boolean, default: false },
  helpful:  { type: Number, default: 0 },
  images:   [String],
}, { timestamps: true });

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
