export const fields = {
  hs_code: {
    type: 'string',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  productCategory: {
    type: 'async',
    label: 'product Category',
    displayLabels: ['productCategory', 'name'],
    dataIndex: ['productCategory', 'name'],
    entity: 'productcategory',
    required: true,
  },
  productVendor: {
    type: 'async',
    label: 'Vendor',
    displayLabels: ['company', 'name'],
    dataIndex: ['company', 'name'],
    entity: 'company',
    required: false,
  },
};
