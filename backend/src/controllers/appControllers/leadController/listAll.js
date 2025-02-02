const { migrate } = require('./migrate');

const listAll = async (Model, req, res) => {
  try {
    const sortDirection = parseInt(req.query.sort) || -1; // Default descending
    const sortField = req.query.sortBy || 'date'; // Default sort by delivery date

    const results = await Model.find({ removed: false })
      .sort({ [sortField]: sortDirection })
      .populate('people', 'name email phone')
      .populate('items.product', 'name hs_code unit_size')
      .populate('converted.quote', 'number year')
      .lean();

    const migratedData = results.map((challan) => ({
      ...migrate(challan),
      totalItems: challan.items.length,
      totalQuantity: challan.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      paymentStatus: challan.paymentStatus || 'unpaid',
    }));

    if (migratedData.length > 0) {
      return res.status(200).json({
        success: true,
        result: migratedData,
        message: `Found ${migratedData.length} delivery challans`,
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
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

module.exports = listAll;
