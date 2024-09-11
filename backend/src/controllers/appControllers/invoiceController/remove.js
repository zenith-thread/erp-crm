const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');

const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the invoice and delete it
    const result = await Model.findByIdAndDelete(id);

    // Check if the invoice exists
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      result,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting the invoice',
      error: error.message,
    });
  }
};

module.exports = deleteInvoice;
