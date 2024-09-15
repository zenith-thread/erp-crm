const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

const update = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No employee found to update',
      });
    }

    return res.status(200).json({
      success: true,
      result: employee,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error updating employee: ' + error.message,
    });
  }
};

module.exports = update;
