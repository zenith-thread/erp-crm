const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Employee');

const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const read = require('./read');

methods.create = create;
methods.update = update;
methods.delete = remove;
methods.read = read;

module.exports = methods;
