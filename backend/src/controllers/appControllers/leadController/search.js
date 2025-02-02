const { migrate } = require('./migrate');

const search = async (Model, req, res) => {
  const q = req.query.q?.trim();

  if (!q) {
    return res.status(400).json({
      success: false,
      result: [],
      message: 'Please provide a search query',
    });
  }

  // Default fields to search if none specified
  const fieldsArray = req.query.fields
    ? req.query.fields.split(',')
    : ['number', 'year', 'content', 'notes', 'items.description', 'items.unit_size'];

  const searchQuery = {
    $or: fieldsArray.map((field) => {
      // Handle numeric fields differently
      if (['number', 'year'].includes(field)) {
        if (!isNaN(q)) {
          return { [field]: parseInt(q) };
        }
      }
      return {
        [field]: {
          $regex: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      };
    }),
    removed: false,
  };

  try {
    const results = await Model.find(searchQuery)
      .limit(20)
      .sort('-date')
      .populate('people', 'name')
      .populate('items.product', 'name')
      .lean();

    const migratedData = results.map((challan) => ({
      ...migrate(challan),
      // Add quick summary calculations
      itemCount: challan.items.length,
      totalQuantity: challan.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    }));

    return res.status(200).json({
      success: true,
      result: migratedData,
      message: `Found ${migratedData.length} matching delivery challans`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Error searching delivery challans',
      error: error.message,
    });
  }
};

module.exports = search;
