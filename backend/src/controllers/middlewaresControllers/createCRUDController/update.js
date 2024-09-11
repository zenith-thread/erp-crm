const update = async (Model, req, res) => {
  try {
    // Find the document by ID and update it with the new data from the request body
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    // If no document is found, return a 404 error
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found to update',
      });
    }

    // Return success response after updating the document
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully updated the document',
    });
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the document',
      error: error.message,
    });
  }
};

module.exports = update;
