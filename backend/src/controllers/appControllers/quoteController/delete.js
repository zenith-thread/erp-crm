const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

const deleteQuote = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the quote and delete it
    const result = await Model.findByIdAndDelete(id);

    // Check if the quote exists
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      result,
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting the quote',
      error: error.message,
    });
  }
};

module.exports = deleteQuote;
