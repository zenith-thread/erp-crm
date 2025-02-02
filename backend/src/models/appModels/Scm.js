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
  name_scm: {
    type: String,
    required: true,
  },
  ntnNumber_scm: {
    type: String,
  },
  bankAccountTitle_scm: {
    type: String,
    trim: true,
  },
  bankName_scm: {
    type: String,
    trim: true,
  },
  bankBranchCode_scm: {
    type: String,
    trim: true,
  },
  bankIban_scm: {
    type: String,
    trim: true,
  },
  bankSwift_scm: {
    type: String,
    trim: true,
  },
  bankAccountNumber_scm: {
    type: String,
    trim: true,
  },
  bankCode_scm: {
    type: String,
    trim: true,
  },
  address_scm: {
    type: String,
  },
  city_scm: {
    type: String,
  },
  State_scm: {
    type: String,
  },
  postalCode_scm: {
    type: Number,
  },
  country_scm: {
    type: String,
    trim: true,
  },
  phone_scm: {
    type: String,
    trim: false,
  },
  otherPhone_scm: [
    {
      type: String,
      trim: false,
    },
  ],
  email_scm: {
    type: String,
    trim: false,
    lowercase: true,
  },
  otherEmail_scm: [
    {
      type: String,
      trim: false,
      lowercase: true,
    },
  ],
  website_scm: {
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
  peoples: [{ type: mongoose.Schema.ObjectId, ref: 'People', autopopulate: true }],
  mainContact: { type: mongoose.Schema.ObjectId, ref: 'People', autopopulate: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Scm', schema);
