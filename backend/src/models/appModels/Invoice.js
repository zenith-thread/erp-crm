const mongoose = require('mongoose');

const deliveryChallanSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },

  // dcRef: { type: mongoose.Schema.ObjectId, ref: 'DeliveryChallan', required: true },

  scm: { type: mongoose.Schema.ObjectId, ref: 'Scm', required: true },

  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  content: String,
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
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
    required: false,
    autopopulate: true,
  },
  converted: {
    from: {
      type: String,
      enum: ['quote'],
    },
    quote: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quote',
    },
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
    default: 'NA',
    uppercase: true,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
    default: 'draft',
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

deliveryChallanSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Invoice', deliveryChallanSchema);
