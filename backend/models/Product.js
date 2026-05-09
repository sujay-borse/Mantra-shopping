const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  brand:       { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  original:    { type: Number },
  category:    { type: String, required: true, enum: ['men','women','kids','beauty','living'] },
  images:      [{ type: String }],
  tags:        [{ type: String }],
  sizes:       [{ type: String }],
  colors:      [{ type: String }],
  stock:       { type: Number, default: 50 },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  views:       { type: Number, default: 0 },
  sold:        { type: Number, default: 0 },
  isNew:       { type: Boolean, default: true },
  isTrending:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tag:         { type: String, enum: ['Sale', 'New', 'Trending', ''] },
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
