const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');

const { calculate } = require('@/helpers');

const updateInvoice = async (req, res) => {
  const { items = [], taxRate = 0, discount = 0 } = req.body;

  try {
    // Default calculations
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    // Calculate items, subTotal, total, taxTotal
    items.map((item) => {
      let itemTotal = calculate.multiply(item['quantity'], item['price']);
      itemTotal = calculate.add(itemTotal, item['transportation']);
      itemTotal = calculate.add(itemTotal, item['misc_expenses']);
      itemTotal = calculate.add(itemTotal, (item['profit'] / 100) * itemTotal);

      subTotal = calculate.add(subTotal, itemTotal);
      item['total'] = itemTotal;
    });

    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);

    let body = req.body;
    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['items'] = items;
    body['updatedBy'] = req.admin._id;

    // Update the existing invoice in the collection
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      { ...body },
      { new: true, runValidators: true }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Return successful response with the updated invoice
    return res.status(200).json({
      success: true,
      result,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    // Handle errors that may occur
    return res.status(500).json({
      success: false,
      message: 'Error updating invoice',
      error: error.message,
    });
  }
};

module.exports = updateInvoice;
