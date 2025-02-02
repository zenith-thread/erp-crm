const { migrate } = require('./migrate');

const paginatedList = async (Model, req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    // Default sort by latest delivery date
    const sortBy = req.query.sortBy || 'date';
    const sortValue = req.query.sortValue || -1;

    // Field filtering
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    const fields = fieldsArray.length > 0 ? { $or: [] } : {};
    fieldsArray.forEach((field) => {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    });

    // Date range filtering
    const dateFilter = {};
    if (req.query.startDate) {
      dateFilter.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      dateFilter.$lte = new Date(req.query.endDate);
    }

    // Build main query
    const query = {
      removed: false,
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.paymentStatus && { paymentStatus: req.query.paymentStatus }),
      ...(req.query.convertedFrom && { 'converted.from': req.query.convertedFrom }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      ...fields,
    };

    // Query results
    const resultsPromise = Model.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('people', 'name email')
      .populate('items.product', 'name hs_code')
      .populate('converted.quote', 'number year')
      .lean();

    // Count total documents
    const countPromise = Model.countDocuments(query);

    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    const pages = Math.ceil(count / limit);

    // Add financial calculations
    const migratedData = result.map((challan) => ({
      ...migrate(challan),
      totalPayments: challan.payment?.reduce((sum, p) => sum + p.amount, 0) || 0,
      balanceDue: challan.total - (challan.payment?.reduce((sum, p) => sum + p.amount, 0) || 0),
    }));

    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result: migratedData,
        pagination,
        message: 'Successfully found delivery challans',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        pagination,
        message: 'No delivery challans found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = paginatedList;
