const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const EmployeePasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Employee', required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: String,
  resetToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// Hash password using salt
EmployeePasswordSchema.methods.generateHash = function (salt, password) {
  return bcrypt.hashSync(salt + password, 10); // Use bcrypt with salt
};

// Validate password
EmployeePasswordSchema.methods.validPassword = function (salt, inputPassword) {
  return bcrypt.compareSync(salt + inputPassword, this.password);
};

module.exports = mongoose.model('EmployeePassword', EmployeePasswordSchema);
