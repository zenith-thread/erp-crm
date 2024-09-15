const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

const create = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const result = await employee.save();
    return res.status(200).json({
      success: true,
      result,
      message: 'Employee created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error creating employee: ' + error.message,
    });
  }
};

module.exports = create;
