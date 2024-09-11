const mongoose = require('mongoose');
const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  const settings = req.body.settings; // Expecting an array of settings

  // Check if settings array is provided
  if (!Array.isArray(settings) || settings.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'No settings provided',
    });
  }

  try {
    const updatedSettings = [];

    // Iterate over the settings array and update each setting
    for (const setting of settings) {
      const { settingKey, ...updateData } = setting;

      if (!settingKey) {
        continue; // Skip if no settingKey is provided for a setting
      }

      // Update the setting by settingKey
      const updatedSetting = await Model.findOneAndUpdate(
        { settingKey },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (updatedSetting) {
        updatedSettings.push(updatedSetting); // Collect updated settings
      }
    }

    // Return success response with all updated settings
    return res.status(200).json({
      success: true,
      result: updatedSettings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    // Handle any errors during the update
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error updating settings',
      error: error.message,
    });
  }
};

module.exports = updateManySetting;
