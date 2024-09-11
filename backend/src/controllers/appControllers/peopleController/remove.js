const remove = async (Model, req, res) => {
  const { id } = req.params;

  try {
    // Find the person by ID and mark as removed
    const result = await Model.findOneAndUpdate(
      { _id: id, removed: false }, // Only allow deletion if not already removed
      { $set: { removed: true } }, // Soft delete by marking removed as true
      { new: true } // Return the updated document
    ).exec();

    // Check if the person exists
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Person not found or already removed',
      });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      result,
      message: 'Person removed successfully',
    });
  } catch (error) {
    // Handle errors that may occur
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error removing person',
      error: error.message,
    });
  }
};

module.exports = remove;
