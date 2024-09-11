const mongoose = require('mongoose');

const remove = async (Model, req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Feature needs to be implemented',
  });
};
module.exports = remove;
