const mongoose = require('mongoose');
const Model = mongoose.model('Quote');

const { calculate } = require('@/helpers');

const update = async (req, res) => {
  const { items = [], taxRate = 0, taxRate2 = 0, discount = 0 } = req.body;

  try {
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

    let body = req.body;
    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;
    body['taxTotal2'] = taxTotal2;
    body['items'] = items;
    body['updatedBy'] = req.admin._id;

    // Update the existing document in the collection
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      { ...body },
      { new: true, runValidators: true }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    // Return successful response with the updated document
    return res.status(200).json({
      success: true,
      result,
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

module.exports = update;
