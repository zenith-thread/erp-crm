const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const EmployeePassword = mongoose.model('EmployeePassword');
const crypto = require('crypto');

const create = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      birthday,
      birthplace,
      gender,
      address,
      state,
      department,
      position,
      phone,
      email,
    } = req.body;

    // Validate required fields
    if (
      !firstname ||
      !lastname ||
      !birthday ||
      !email ||
      !gender ||
      !address ||
      !department ||
      !position
    ) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Please fill in all the required input fields!',
      });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }

    // Create new employee
    const newEmployee = new Employee({
      firstname,
      lastname,
      birthday,
      birthplace,
      gender,
      address,
      state,
      department,
      position,
      phone,
      email,
    });
    // Save to database
    const savedEmployee = await newEmployee.save();

    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString('hex'); // Random 16-character password
    const salt = crypto.randomBytes(16).toString('hex'); // Generate salt

    // Hash and save the password
    const employeePassword = new EmployeePassword({
      user: savedEmployee._id,
      salt: salt,
      password: EmployeePassword.prototype.generateHash(salt, randomPassword),
    });

    await employeePassword.save();

    return res.status(201).json({
      success: true,
      result: {
        savedEmployee,
        password: randomPassword, // Only show this once; do not send back hashed password
      },
      message: 'Employee created successfully with a random password.',
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error creating employee: ' + error.message,
    });
  }
};

module.exports = create;
