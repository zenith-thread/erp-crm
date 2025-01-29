const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    required: true,
    autopopulate: true,
  },
  productVendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
    autopopulate: true,
  },
  name: {
    type: String,
    required: true,
  },
  hs_code: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Product', schema);
