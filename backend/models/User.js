const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, minlength: 6 },
  role:          { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  avatar:        { type: String, default: '' },
  phone:         { type: String, default: '' },
  googleId:      { type: String },
  membership:    { type: String, enum: ['basic', 'pro', 'premium'], default: 'basic' },
  membershipExp: { type: Date },
  rewardPoints:  { type: Number, default: 0 },
  referralCode:  { type: String, unique: true, sparse: true },
  addresses: [{
    label:   String, name: String, phone: String,
    line1:   String, line2: String, city: String,
    state:   String, pincode: String, isDefault: Boolean,
  }],
  wishlist:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  lastLogin:    { type: Date },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
