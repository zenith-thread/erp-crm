const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  ntnNumber: {
    type: String,
  },
  bankAccountTitle: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    trim: true,
  },
  bankBranch: {
    type: String,
    trim: true,
  },
  bankIban: {
    type: String,
    trim: true,
  },
  bankSwift: {
    type: String,
    trim: true,
  },
  bankAccountNumber: {
    type: String,
    trim: true,
  },
  bankCode: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  State: {
    type: String,
  },
  postalCode: {
    type: Number,
  },
  country: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  otherPhone: [
    {
      type: String,
      trim: true,
    },
  ],
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  otherEmail: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  website: {
    type: String,
    trim: true,
    lowercase: true,
  },
  // interestedIn: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  source: String,
  category: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company' },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('People', schema);
