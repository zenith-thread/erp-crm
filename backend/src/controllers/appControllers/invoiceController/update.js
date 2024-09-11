const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const custom = require('@/controllers/pdfController');

const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const update = async (req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Feature needs to be implemented',
  });
};

module.exports = update;
