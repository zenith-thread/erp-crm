const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

const read = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, removed: false })
      .populate('isAdmin', 'name')
      .exec();

    if (!employee) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No employee found',
      });
    }

    return res.status(200).json({
      success: true,
      result: employee,
      message: 'Employee found successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error fetching employee: ' + error.message,
    });
  }
};

module.exports = read;
