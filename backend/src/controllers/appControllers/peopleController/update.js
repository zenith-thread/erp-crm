const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Lead = mongoose.model('People');

const update = async (Model, req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Feature needs to be implemented',
  });
};

module.exports = update;
