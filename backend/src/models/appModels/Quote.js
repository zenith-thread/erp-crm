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
    type: String,
    required: false,
  },
  pr_number: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  content: String,
  date: {
    type: Date,
    required: false,
  },
  priceValidity: {
    type: Date,
    required: false,
  },

  people: {
    type: mongoose.Schema.ObjectId,
    ref: 'People',
    required: true,
    autopopulate: true,
  },

  dcRef: { type: mongoose.Schema.ObjectId, ref: 'DeliveryChallan', required: false },
  invoiceRef: { type: mongoose.Schema.ObjectId, ref: 'Invoice', required: false },
  net_recievable_amount: {
    type: Number,
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
      },
      individualTaxRate2: {
        type: Number,
      },
      individualTaxRate: {
        type: Number,
      },
      ServiceCharge12Tax: {
        type: Number,
      },
      serviceChargesAmount: {
        type: Number,
      },
      quoteAmount: {
        type: String,
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
    default: 'Rs',
    uppercase: true,
    required: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment_terms: {
    type: String,
    required: false,
  },
  delivery_terms: {
    type: String,
    required: false,
  },
  quoteStatus: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'approved', 'declined', 'cancelled', 'on hold'],
    default: 'pending',
  },
  generateDC: {
    type: String,
    enum: ['yes', 'no'],
    default: 'yes',
    required: false,
  },
  deliveryStatus: {
    type: String,
    enum: ['draft', 'pending', 'delivered', 'declined', 'cancelled', 'returned', 'on hold'],
    default: 'pending',
  },
  po_number: {
    type: String,
    required: false,
  },
  scm: { type: mongoose.Schema.ObjectId, ref: 'Scm', required: true },
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
