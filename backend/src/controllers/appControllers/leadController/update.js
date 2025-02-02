const mongoose = require('mongoose');
const DeliveryChallan = mongoose.model('DeliveryChallan');
const Quote = mongoose.model('Quote');

const update = async (Model, req, res) => {
  try {
    const existingChallan = await DeliveryChallan.findOne({
      _id: req.params.id,
      removed: false,
    });

    if (!existingChallan) {
      return res.status(404).json({
        success: false,
        message: 'Delivery challan not found',
      });
    }

    // Prevent modification of converted quote relationship
    if (existingChallan.converted?.quote && req.body.converted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify conversion details for quote-based challans',
      });
    }

    // Validate status transitions
    const allowedStatuses = ['draft', 'pending', 'delivered', 'cancelled'];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    // Lock financial fields if challan is converted from quote
    if (existingChallan.converted?.quote) {
      const protectedFields = [
        'subTotal',
        'taxRate',
        'taxTotal',
        'taxRate2',
        'taxTotal2',
        'total',
        'items',
      ];
      protectedFields.forEach((field) => {
        if (req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `Cannot modify ${field} in quote-converted challans`,
          });
        }
      });
    }

    // Handle file updates
    if (req.body.files) {
      req.body.files = [...existingChallan.files, ...req.body.files];
    }

    // Update document
    const result = await Model.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate('people items.product');

    // Auto-generate PDF on finalization
    if (result.status === 'delivered') {
      await generateDeliveryChallanPdf(result);
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Delivery challan updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const generateDeliveryChallanPdf = async (challan) => {
  // PDF generation logic similar to quote system
  const pdfPath = `public/pdf/delivery-challan-${challan.number}.pdf`;

  await createPdf(
    'deliveryChallan',
    {
      filename: `delivery-challan-${challan.number}`,
      format: 'A4',
      targetLocation: pdfPath,
    },
    challan
  );

  await DeliveryChallan.findByIdAndUpdate(challan._id, {
    pdf: pdfPath,
  });
};

module.exports = update;
