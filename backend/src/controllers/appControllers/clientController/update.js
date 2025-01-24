const mongoose = require('mongoose');

const People = mongoose.model('People');
const Company = mongoose.model('Company');
const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');

const update = async (Model, req, res) => {
  try {
    const { id } = req.params;

    // Check if the client exists
    const existingClient = await Model.findOne({ _id: id, removed: false }).exec();
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `No client found with id: ${id}`,
      });
    }

    // Update the client based on type (people or company)
    if (existingClient.type === 'people') {
      const { firstname, lastname } = await People.findOneAndUpdate(
        { _id: req.body.people, removed: false },
        { isClient: true },
        { new: true, runValidators: true }
      ).exec();

      req.body.name = `${firstname} ${lastname}`;
      req.body.company = undefined; // Ensure company field is cleared for a "people" type client
    } else if (existingClient.type === 'company') {
      const { name } = await Company.findOneAndUpdate(
        { _id: req.body.company, removed: false },
        { isClient: true },
        { new: true, runValidators: true }
      ).exec();

      req.body.name = name;
      req.body.people = undefined; // Ensure people field is cleared for a "company" type client
    }

    req.body.removed = false; // Ensure the removed flag is always false

    // Update the client in the database
    const updatedClient = await Model.findOneAndUpdate({ _id: id, removed: false }, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `Failed to update client with id: ${id}`,
      });
    }

    // Reflect changes in related quotes and invoices
    const updates = { clientName: updatedClient.name, clientEmail: updatedClient.email };
    await Promise.all([
      QuoteModel.updateMany({ client: id, removed: false }, updates).exec(),
      InvoiceModel.updateMany({ client: id, removed: false }, updates).exec(),
    ]);

    return res.status(200).json({
      success: true,
      result: updatedClient,
      message:
        'Successfully updated the client and reflected changes in related quotes and invoices',
    });
  } catch (error) {
    console.error('Error during client update:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while updating the client',
    });
  }
};

module.exports = update;
