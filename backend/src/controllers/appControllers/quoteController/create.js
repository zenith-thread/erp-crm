const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

const custom = require('@/controllers/pdfController');
const { increaseBySettingKey } = require('@/middlewares/settings');
const { calculate } = require('@/helpers');

const create = async (req, res) => {
  const { items = [], taxRate = 0, taxRate2 = 0, discount = 0 } = req.body;

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let taxTotal2 = 0;
  let total = 0;
  let totalQuantity = 0;
  // let credit = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    total = calculate.add(total, item['transportation']);
    total = calculate.add(total, item['misc_expenses']);
    total = calculate.add(total, (item['profit'] / 100) * total);
    let preTaxCost = total;
    preTaxCost = calculate.add(
      calculate.multiply(preTaxCost, item['individualTaxRate'] / 100),
      preTaxCost
    );
    preTaxCost = calculate.multiply(preTaxCost, item['individualTaxRate2'] / 100);

    total = Math.ceil(calculate.add(preTaxCost, total));
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['total'] = total;
    totalQuantity = calculate.add(totalQuantity, item['quantity']);
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
  body['createdBy'] = req.admin._id;
  body['totalQuantity'] = totalQuantity;

  // Creating a new document in the collection
  const result = await new Model(body).save();
  const fileId = 'quote-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({
    settingKey: 'last_quote_number',
  });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Quote created successfully',
  });
};
module.exports = create;
