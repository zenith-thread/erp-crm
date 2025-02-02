const mongoose = require('mongoose');
const Model = mongoose.model('Quote');
const DeliveryChallan = mongoose.model('DeliveryChallan');
const Invoice = mongoose.model('Invoice');
const custom = require('@/controllers/pdfController');
const { increaseBySettingKey } = require('@/middlewares/settings');
const { calculate } = require('@/helpers');

const getNextChallanNumber = async () => {
  try {
    const lastChallan = await DeliveryChallan.findOne().sort({ number: -1 }).lean();
    return lastChallan ? lastChallan.number + 1 : 1;
  } catch (error) {
    console.error('Error generating challan number:', error);
    throw new Error('Failed to generate delivery challan number');
  }
};

const create = async (req, res) => {
  const { items = [], taxRate = 0, taxRate2 = 0 } = req.body;

  console.log('LOGGING FROM BACKEND FOR SCMREF: ', req.body);

  try {
    let subTotal = 0;
    let taxTotal = 0;
    let taxTotal2 = 0;
    let total = 0;
    let totalQuantity = 0;

    // Updated calculation to match frontend logic
    items.forEach((item) => {
      let itemTotal;

      if (item.ServiceCharge12Tax) {
        // Service Charge Calculation
        itemTotal = calculate.multiply(item.quantity, item.price);
        const serviceCharges = calculate.multiply(itemTotal, item.ServiceCharge12Tax / 100);
        itemTotal = Math.ceil(calculate.add(itemTotal, serviceCharges));
      } else {
        // Individual Taxes Calculation
        itemTotal = calculate.multiply(item.quantity, item.price);
        itemTotal = calculate.add(itemTotal, item.transportation);
        itemTotal = calculate.add(itemTotal, item.misc_expenses);
        itemTotal = calculate.add(itemTotal, calculate.multiply(itemTotal, item.profit / 100));

        const tax1 = calculate.multiply(itemTotal, item.individualTaxRate / 100);
        const tax2 = calculate.multiply(
          calculate.add(itemTotal, tax1),
          item.individualTaxRate2 / 100
        );

        itemTotal = Math.ceil(calculate.add(itemTotal, tax1, tax2));
      }

      item.total = itemTotal;
      subTotal = calculate.add(subTotal, itemTotal);
      totalQuantity = calculate.add(totalQuantity, item.quantity);
    });

    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);
    taxTotal2 = calculate.multiply(total, taxRate2 / 100);

    const body = {
      ...req.body,
      subTotal,
      taxTotal,
      taxTotal2,
      total,
      items,
      totalQuantity,
      createdBy: req.admin._id,
    };

    // Create the quote
    const result = await new Model(body).save();

    // Generate documents if needed
    const generatedDocs = [];

    // Create Delivery Challan if conditions met
    if (result.quoteStatus === 'approved' && result.generateDC === 'yes') {
      const challanData = {
        ...result.toObject(),
        converted: { from: 'quote', quote: result._id },
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
      const challan = await DeliveryChallan.create(challanData);
      generatedDocs.push({ type: 'challan', id: challan._id });
    }

    // Create Invoice if delivery status is delivered
    if (result.deliveryStatus === 'delivered') {
      const invoiceData = {
        ...result.toObject(),
        converted: { from: 'quote', quote: result._id },
        status: 'draft',
        number: await getNextChallanNumber(), // Should have separate invoice number sequence
        year: new Date().getFullYear(),
        deliveryStatus: 'pending',
        _id: undefined,
        __v: undefined,
        quoteStatus: undefined,
        pdf: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
      const invoice = await Invoice.create(invoiceData);
      generatedDocs.push({ type: 'invoice', id: invoice._id });
    }

    // Update PDF after document generation
    const fileId = `quote-${result._id}.pdf`;
    const updateResult = await Model.findByIdAndUpdate(
      result._id,
      { pdf: fileId },
      { new: true }
    ).lean();

    increaseBySettingKey({ settingKey: 'last_quote_number' });

    return res.status(200).json({
      success: true,
      result: {
        ...updateResult,
        generatedDocs,
      },
      message: 'Quote created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating quote',
      error: error.message,
    });
  }
};

module.exports = create;
