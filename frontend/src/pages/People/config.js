export const fields = {
  name: {
    type: 'string',
    label: 'Name',
    required: true,
    hasFeedback: true,
    disableForForm: false,
    width: 100,
  },
  ntnNumber: {
    type: 'string',
    label: 'NTN Number',
    hasFeedback: true,
    disableForForm: false,
  },
  bankAccountTitle: {
    type: 'string',
    label: 'Account Title',
    disableForForm: false,
    hasFeedback: true,
  },
  bankName: {
    type: 'string',
    label: 'Bank Name',
    disableForForm: false,
    hasFeedback: true,
  },
  bankBranch: {
    type: 'string',
    label: 'Bank Branch',
    disableForForm: false,
    hasFeedback: true,
  },
  bankIban: {
    type: 'string',
    label: 'Bank IBAN',
    disableForForm: false,
    hasFeedback: true,
  },
  bankSwift: {
    type: 'string',
    label: 'Bank SWIFT Code',
    disableForForm: false,
    hasFeedback: true,
  },
  bankAccountNumber: {
    type: 'string',
    label: 'Bank Account Number',
    disableForForm: false,
    hasFeedback: true,
  },
  bankCode: {
    type: 'string',
    label: 'Bank Code',
    disableForForm: false,
    hasFeedback: true,
  },
  address: {
    type: 'text',
    label: 'Address',
    disableForForm: false,
    hasFeedback: true,
  },
  city: {
    type: 'string',
    label: 'City',
    disableForForm: false,
    hasFeedback: true,
  },
  State: {
    type: 'string',
    label: 'State',
    disableForForm: false,
    hasFeedback: true,
  },
  postalCode: {
    type: 'number',
    label: 'Postal Code',
    disableForForm: false,
    hasFeedback: true,
  },
  country: {
    type: 'country', // Custom country field type
    label: 'Country',
    disableForForm: false,
    hasFeedback: true,
  },
  phone: {
    type: 'phone', // Custom phone field type
    label: 'Phone',
    disableForForm: false,
    hasFeedback: true,
    trim: true,
  },
  otherPhone: {
    type: 'phone',
    label: 'Other Phone Number',
    disableForForm: false,
    hasFeedback: true,
    trim: true,
  },
  email: {
    type: 'email', // Custom email field type
    label: 'Email',
    disableForForm: false,
    hasFeedback: true,
  },
  otherEmail: {
    type: 'email',
    label: 'Other Emails',
    disableForForm: false,
    hasFeedback: true,
  },
  website: {
    type: 'string',
    label: 'Website',
    disableForForm: false,
    hasFeedback: true,
  },
  createdBy: {
    type: 'reference',
    label: 'Created By',
    entity: 'admin', // Reference entity name for Admin
    displayLabels: ['firstname', 'lastname'],
    searchFields: 'firstname,lastname',
    disableForTable: true,
    disableForForm: true,
  },
  created: {
    type: 'date',
    label: 'Created At',
    disableForForm: true,
  },
  updated: {
    type: 'date',
    label: 'Last Updated',
    disableForForm: true,
  },
};
