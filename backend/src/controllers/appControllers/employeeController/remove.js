const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

const remove = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { removed: true },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No employee found to delete',
      });
    }

    return res.status(200).json({
      success: true,
      result: employee,
      message: 'Employee deleted successfully (soft delete)',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error deleting employee: ' + error.message,
    });
  }
};

module.exports = remove;
