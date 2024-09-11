const mongoose = require('mongoose');
const Model = mongoose.model('Setting');

const updateBySettingKey = async (req, res) => {
  const settingKey = req.params.settingKey;

  // Check if settingKey is provided
  if (!settingKey) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'No settingKey provided',
    });
  }

  try {
    // Find the setting by settingKey and update it with new data
    const result = await Model.findOneAndUpdate(
      { settingKey }, // Find the setting by settingKey
      { $set: req.body }, // Update the setting with new data from req.body
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    // If no setting found, return an error
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `No document found with this settingKey: ${settingKey}`,
      });
    }

    // Return success response with the updated setting
    return res.status(200).json({
      success: true,
      result,
      message: 'Setting updated successfully',
    });
  } catch (error) {
    // Handle any errors that occur during update
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error updating setting',
      error: error.message,
    });
  }
};

module.exports = updateBySettingKey;
