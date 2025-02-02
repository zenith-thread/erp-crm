const mongoose = require('mongoose');
const Quote = mongoose.model('Quote');

const create = async (Model, req, res) => {
  try {
    // Check if this is a conversion from quote
    if (req.body.converted?.quote) {
      const sourceQuote = await Quote.findOne({
        _id: req.body.converted.quote,
        removed: false,
      }).exec();

      if (!sourceQuote) {
        return res.status(404).json({
          success: false,
          message: 'Source quote not found',
        });
      }

      if (sourceQuote.quoteStatus !== 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Only approved quotes can be converted to delivery challans',
        });
      }

      // Auto-generate challan number
      const lastChallan = await Model.findOne().sort({ number: -1 });
      req.body.number = lastChallan ? lastChallan.number + 1 : 1;
      req.body.year = new Date().getFullYear();

      // Map quote data to challan
      req.body = {
        ...req.body,
        people: sourceQuote.people,
        items: sourceQuote.items.map((item) => ({
          product: item.product,
          unit_size: item.unit_size,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          transportation: item.transportation,
          misc_expenses: item.misc_expenses,
          profit: item.profit,
          total: item.total,
          individualTaxRate: item.individualTaxRate,
          individualTaxRate2: item.individualTaxRate2,
          quoteAmount: item.quoteAmount || 'N/A',
        })),
        date: new Date(),
        priceValidity: sourceQuote.priceValidity,
        subTotal: sourceQuote.subTotal,
        taxRate: sourceQuote.taxRate,
        taxTotal: sourceQuote.taxTotal,
        taxRate2: sourceQuote.taxRate2,
        taxTotal2: sourceQuote.taxTotal2,
        total: sourceQuote.total,
        currency: sourceQuote.currency,
        paymentStatus: 'unpaid',
        status: 'draft',
        quoteStatus: sourceQuote.quoteStatus,
        deliveryStatus: sourceQuote.deliveryStatus,
        po_number: sourceQuote.po_number,
        pr_number: sourceQuote.pr_number,
      };
    }

    // Common fields
    req.body.removed = false;
    req.body.approved = false;
    req.body.pdf = '';
    req.body.files = [];

    const result = await new Model(req.body).save();

    return res.status(200).json({
      success: true,
      result,
      message: 'Delivery challan created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = create;
