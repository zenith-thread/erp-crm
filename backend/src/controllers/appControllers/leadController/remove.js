const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');

const remove = async (Model, req, res) => {
  try {
    const challan = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: 'Delivery challan not found',
      });
    }

    // Check payment associations
    if (challan.payment?.length > 0) {
      await Payment.updateMany(
        { _id: { $in: challan.payment } },
        { $pull: { challan: challan._id } }
      );
    }

    // Soft delete with removal timestamp
    const result = await Model.findByIdAndUpdate(
      req.params.id,
      {
        removed: true,
        removedBy: req.admin._id,
        removedAt: Date.now(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      result,
      message: 'Delivery challan marked as removed',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = remove;
