const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');

const create = async (req, res) => {
  try {
    const body = req.body;
    const { items = [], taxRate = 0, discount = 0 } = body;

    let subTotal = 0;

    // Calculate items
    const calculatedItems = items.map((item) => {
      let total = calculate.multiply(item.quantity, item.price);
      total = calculate.add(total, item.transportation);
      total = calculate.add(total, item.misc_expenses);
      total = calculate.add(total, (item.profit / 100) * total);
      subTotal = calculate.add(subTotal, total);

      return { ...item, total };
    });

    const taxTotal = calculate.multiply(subTotal, taxRate / 100);
    const total = calculate.add(subTotal, taxTotal);
    const paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';

    const invoiceData = {
      ...body,
      items: calculatedItems,
      subTotal,
      taxTotal,
      total,
      paymentStatus,
      createdBy: req.admin._id,
    };

    const result = await new Model(invoiceData).save();
    const fileId = `invoice-${result._id}.pdf`;

    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdf: fileId },
      { new: true }
    ).exec();

    increaseBySettingKey({ settingKey: 'last_invoice_number' });

    return res.status(200).json({
      success: true,
      result: updateResult,
      message: 'Invoice created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = create;
