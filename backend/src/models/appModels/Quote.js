const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },

  converted: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  content: String,
  date: {
    type: Date,
    required: true,
  },
  priceValidity: {
    type: Date,
    required: true,
  },

  people: {
    type: mongoose.Schema.ObjectId,
    ref: 'People',
    required: true,
    autopopulate: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
        autopopulate: true,
      },
      unit_size: {
        type: String,
      },
      description: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      transportation: {
        type: Number,
        default: 0,
      },
      misc_expenses: {
        type: Number,
        default: 0,
      },
      profit: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      individualTaxRate2: {
        type: Number,
      },
      individualTaxRate: {
        type: Number,
      },
    },
  ],
  totalQuantity: {
    type: Number,
  },
  taxRate: {
    type: Number,
  },
  taxRate2: {
    type: Number,
  },
  subTotal: {
    type: Number,
  },
  taxTotal: {
    type: Number,
  },
  taxTotal2: {
    type: Number,
  },
  total: {
    type: Number,
  },
  credit: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment_terms: {
    type: String,
    required: true,
  },
  delivery_terms: {
    type: String,
    required: true,
  },
  quoteStatus: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'approved', 'declined', 'cancelled', 'on hold'],
    default: 'pending',
  },
  deliveryStatus: {
    type: String,
    enum: ['draft', 'pending', 'delivered', 'declined', 'cancelled', 'returned', 'on hold'],
    default: 'pending',
  },
  po_number: {
    type: Number,
    required: false,
  },
  pdf: {
    type: String,
  },
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  ],
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

quoteSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Quote', quoteSchema);
