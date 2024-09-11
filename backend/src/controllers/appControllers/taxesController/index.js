const mongoose = require('mongoose');
const Model = mongoose.model('Taxes');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Taxes');

// Remove default delete method
delete methods['delete'];

// Create Method (already exists)
methods.create = async (req, res) => {
  const { isDefault } = req.body;

  // If tax is set as default, update all others to false
  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
  });

  const result = await new Model({
    ...req.body,
    isDefault: countDefault < 1 ? true : false,
  }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'Tax created successfully',
  });
};

methods.delete = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the tax document to get its name and value
    const tax = await Model.findById(id);
    if (!tax) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Tax not found',
      });
    }

    // Check if the tax is being used in any invoice (based on name or value)
    const invoicesUsingTax = await mongoose.model('Invoice').countDocuments({
      $or: [
        { 'items.taxName': tax.taxName }, // If the tax is referenced by name
        { 'items.taxValue': tax.taxValue }, // If the tax is referenced by value
      ],
    });

    // If the tax is used in any invoice, prevent deletion
    if (invoicesUsingTax > 0) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Tax cannot be deleted as it is being used in other documents like invoices',
      });
    }

    // Delete tax if not in use
    const result = await Model.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Tax not found',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Tax deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting tax',
      error: error.message,
    });
  }
};

// New Update Method
methods.update = async (req, res) => {
  const { id } = req.params;
  const { isDefault } = req.body;

  try {
    // If tax is set as default, update all others to false
    if (isDefault) {
      await Model.updateMany({}, { isDefault: false });
    }

    // Update the tax record
    const result = await Model.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Tax not found',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Tax updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error updating tax',
      error: error.message,
    });
  }
};

module.exports = methods;
