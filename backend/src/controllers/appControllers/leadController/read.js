const { migrate } = require('./migrate');

const read = async (Model, req, res) => {
  try {
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('people', 'name email phone address')
      .populate('items.product', 'name hs_code')
      .populate('converted.quote', 'number year quoteStatus')
      .populate('payment', 'amount method status')
      .lean();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Delivery challan not found',
      });
    }

    // Add calculated fields
    const migratedData = {
      ...migrate(result),
      totalPayments: result.payment?.reduce((sum, p) => sum + p.amount, 0) || 0,
      balanceDue: result.total - (result.payment?.reduce((sum, p) => sum + p.amount, 0) || 0),
    };

    // Include original quote details if converted
    if (result.converted?.quote) {
      migratedData.originalQuote = {
        number: result.converted.quote.number,
        year: result.converted.quote.year,
        status: result.converted.quote.quoteStatus,
      };
    }

    return res.status(200).json({
      success: true,
      result: migratedData,
      message: 'Delivery challan retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = read;
