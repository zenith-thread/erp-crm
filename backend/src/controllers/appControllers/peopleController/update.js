const update = async (Model, req, res) => {
  const { id } = req.params;

  try {
    // Find the person by ID and update the details
    const result = await Model.findOneAndUpdate(
      { _id: id, removed: false }, // Only allow update if not removed
      { $set: req.body }, // Update with new data from req.body
      { new: true, runValidators: true } // Return the updated document and validate input
    )
      .populate('company', 'name')
      .exec();

    // Check if the person exists
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Person not found',
      });
    }

    // Return successful response with updated document
    return res.status(200).json({
      success: true,
      result,
      message: 'Person updated successfully',
    });
  } catch (error) {
    // Handle errors that may occur during the update
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error updating person',
      error: error.message,
    });
  }
};

module.exports = update;
