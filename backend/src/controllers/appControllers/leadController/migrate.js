exports.migrate = (result) => {
  let newData = {};

  newData._id = result._id;
  newData.removed = result.removed;
  newData.createdBy = result.createdBy;
  newData.number = result.number;
  newData.year = result.year;
  newData.content = result.content;
  newData.recurring = result.recurring;
  newData.date = result.date;
  newData.priceValidity = result.priceValidity;
  newData.people = result.people;

  newData.converted = result.converted
    ? {
        from: result.converted.from,
        quote: result.converted.quote,
      }
    : null;

  newData.items =
    result.items?.map((item) => ({
      product: item.product,
      unit_size: item.unit_size,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      transportation: item.transportation,
      misc_expenses: item.misc_expenses,
      profit: item.profit,
      total: item.total,
      individualTaxRate2: item.individualTaxRate2,
      individualTaxRate: item.individualTaxRate,
      quoteAmount: item.quoteAmount,
    })) || [];

  newData.totalQuantity = result.totalQuantity;
  newData.taxRate = result.taxRate;
  newData.taxRate2 = result.taxRate2;
  newData.subTotal = result.subTotal;
  newData.taxTotal = result.taxTotal;
  newData.taxTotal2 = result.taxTotal2;
  newData.total = result.total;
  newData.credit = result.credit;
  newData.currency = result.currency;
  newData.discount = result.discount;
  newData.payment = result.payment;
  newData.po_number = result.po_number;
  newData.pr_number = result.pr_number;
  newData.paymentStatus = result.paymentStatus;
  newData.deliveryStatus = result.deliveryStatus;
  newData.quoteStatus = result.quoteStatus;
  newData.isOverdue = result.isOverdue;
  newData.approved = result.approved;
  newData.notes = result.notes;
  newData.status = result.status;
  newData.pdf = result.pdf;

  newData.files =
    result.files?.map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      description: file.description,
      isPublic: file.isPublic,
    })) || [];

  newData.updated = result.updated;
  newData.created = result.created;

  return newData;
};
