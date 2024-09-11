const remove = async (Model, req, res) => {
  try {
    // Find the document by ID and set the removed field to true (soft delete)
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      { removed: true },
      { new: true }
    ).exec();

    // If no document is found, return a 404 error
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found to delete',
      });
    }

    // Return success response after soft deleting the document
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully deleted the document',
    });
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the document',
      error: error.message,
    });
  }
};

module.exports = remove;
