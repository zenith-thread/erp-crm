const mongoose = require('mongoose');
const Quote = mongoose.model('Quote');
const DeliveryChallan = mongoose.model('DeliveryChallan');
const Invoice = mongoose.model('Invoice');
const { calculate } = require('@/helpers');

const update = async (req, res) => {
  const { items = [], taxRate = 0, taxRate2 = 0, discount = 0 } = req.body;

  try {
    // Get original quote before update
    const originalQuote = await Quote.findById(req.params.id).lean();

    // Default calculations
    let subTotal = 0;
    let taxTotal = 0;
    let taxTotal2 = 0;
    let total = 0;

    // Calculate items, subTotal, total, taxTotal
    items.map((item) => {
      let itemTotal = calculate.multiply(item['quantity'], item['price']);
      itemTotal = calculate.add(itemTotal, item['transportation']);
      itemTotal = calculate.add(itemTotal, item['misc_expenses']);
      itemTotal = calculate.add(itemTotal, (item['profit'] / 100) * itemTotal);

      let preTaxCost = itemTotal;
      preTaxCost = calculate.add(
        calculate.multiply(preTaxCost, item['individualTaxRate'] / 100),
        preTaxCost
      );
      preTaxCost = calculate.multiply(preTaxCost, item['individualTaxRate2'] / 100);

      itemTotal = Math.ceil(calculate.add(preTaxCost, itemTotal));
      //sub total
      subTotal = calculate.add(subTotal, itemTotal);
      //item total
      item['total'] = itemTotal;
    });

    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);

    taxTotal2 = calculate.multiply(total, taxRate2 / 100);

    // Prepare update body
    const updateBody = {
      ...req.body,
      subTotal,
      taxTotal,
      taxTotal2,
      total,
      items,
      updatedBy: req.admin._id,
    };

    // Update the existing document in the collection
    const updatedQuote = await Quote.findOneAndUpdate({ _id: req.params.id }, updateBody, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedQuote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }
    // Determine state changes
    const wasApproved = originalQuote.quoteStatus === 'approved';
    const isApproved = updatedQuote.quoteStatus === 'approved';
    const generateDCWasYes = originalQuote.generateDC === 'yes';
    const generateDCIsYes = updatedQuote.generateDC === 'yes';

    // Calculate conditions
    const shouldDeleteChallan =
      (wasApproved && generateDCWasYes && !generateDCIsYes) || // DC turned off
      (wasApproved && !isApproved); // Unapproved

    const shouldCreateChallan =
      isApproved && generateDCIsYes && (!wasApproved || !generateDCWasYes); // New approval or DC enabled

    // Handle Delivery Challan
    if (shouldDeleteChallan) {
      const challan = await DeliveryChallan.findOneAndUpdate(
        { 'converted.quote': updatedQuote._id, removed: false },
        { removed: true, removedBy: req.admin._id, removedAt: new Date() },
        { new: true }
      );

      if (challan?.payment?.length > 0) {
        await Payment.updateMany(
          { _id: { $in: challan.payment } },
          { $pull: { challan: challan._id } }
        );
      }
    }

    if (shouldCreateChallan) {
      const challanData = {
        ...updatedQuote,
        converted: { from: 'quote', quote: updatedQuote._id },
        status: 'draft',
        number: await getNextChallanNumber(),
        year: new Date().getFullYear(),
        deliveryStatus: 'pending',
        _id: undefined,
        __v: undefined,
        quoteStatus: undefined,
        pdf: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
      await DeliveryChallan.create(challanData);
    }
    // Handle approval status changes
    if (originalQuote.deliveryStatus !== updatedQuote.deliveryStatus) {
      // Case 1: Newly approved - create invoice
      if (updatedQuote.deliveryStatus === 'delivered') {
        const invoiceData = {
          ...updatedQuote,
          converted: { from: 'quote', quote: updatedQuote._id },
          status: 'draft',
          number: await getNextChallanNumber(),
          year: new Date().getFullYear(),
          deliveryStatus: 'pending',
          _id: undefined,
          __v: undefined,
          quoteStatus: undefined,
          pdf: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };
        await Invoice.create(invoiceData);
      }
      // Case 2: Unapproving - remove associated challan
      else if (originalQuote.deliveryStatus === 'delivered') {
        const invoice = await Invoice.findOneAndUpdate(
          {
            'converted.quote': updatedQuote._id,
            removed: false,
          },
          {
            removed: true,
            removedBy: req.admin._id,
            removedAt: new Date(),
          },
          { new: true }
        );

        if (invoice && challan.payment?.length > 0) {
          await Payment.updateMany(
            { _id: { $in: invoice.payment } },
            { $pull: { invoice: invoice._id } }
          );
        }
      }
    }
    // Return successful response with the updated document
    return res.status(200).json({
      success: true,
      result: updatedQuote,
      message: 'Quote updated successfully',
    });
  } catch (error) {
    // Handle errors that may occur
    return res.status(500).json({
      success: false,
      message: 'Error updating quote',
      error: error.message,
    });
  }
};

// Helper function with error handling
async function getNextChallanNumber() {
  try {
    const lastChallan = await DeliveryChallan.findOne().sort({ number: -1 }).lean();
    return lastChallan ? lastChallan.number + 1 : 1;
  } catch (error) {
    console.error('Error generating challan number:', error);
    throw new Error('Failed to generate delivery challan number');
  }
}

module.exports = update;
