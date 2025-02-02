export const fields = {
  name_scm: {
    type: 'string',
    label: 'Name',
    required: true,
    hasFeedback: true,
    disableForForm: false,
    width: 100,
  },
  ntnNumber_scm: {
    type: 'string',
    label: 'NTN Number',
    hasFeedback: true,
    disableForForm: false,
  },
  bankAccountTitle_scm: {
    type: 'string',
    label: 'Account Title',
    disableForForm: false,
    hasFeedback: true,
  },
  bankName_scm: {
    type: 'string',
    label: 'Bank Name',
    disableForForm: false,
    hasFeedback: true,
  },
  bankBranchCode_scm: {
    type: 'string',
    label: 'Bank Branch',
    disableForForm: false,
    hasFeedback: true,
  },
  bankIban_scm: {
    type: 'string',
    label: 'Bank IBAN',
    disableForForm: false,
    hasFeedback: true,
  },
  bankSwift_scm: {
    type: 'string',
    label: 'Bank SWIFT Code',
    disableForForm: false,
    hasFeedback: true,
  },
  bankAccountNumber_scm: {
    type: 'string',
    label: 'Bank Account Number',
    disableForForm: false,
    hasFeedback: true,
  },
  bankCode_scm: {
    type: 'string',
    label: 'Bank Code',
    disableForForm: false,
    hasFeedback: true,
  },
  address_scm: {
    type: 'text',
    label: 'Address',
    disableForForm: false,
    hasFeedback: true,
  },
  city_scm: {
    type: 'string',
    label: 'City',
    disableForForm: false,
    hasFeedback: true,
  },
  State_scm: {
    type: 'string',
    label: 'State',
    disableForForm: false,
    hasFeedback: true,
  },
  postalCode_scm: {
    type: 'number',
    label: 'Postal Code',
    disableForForm: false,
    hasFeedback: true,
  },
  country_scm: {
    type: 'country', // Custom country field type
    label: 'Country',
    disableForForm: false,
    hasFeedback: true,
  },
  phone_scm: {
    type: 'phone', // Custom phone field type
    label: 'Phone',
    disableForForm: false,
    hasFeedback: true,
    trim: true,
  },
  otherPhone_scm: {
    type: 'phone',
    label: 'Other Phone Number',
    disableForForm: false,
    hasFeedback: true,
    trim: true,
  },
  email_scm: {
    type: 'email', // Custom email field type
    label: 'Email',
    disableForForm: false,
    hasFeedback: true,
  },
  otherEmail_scm: {
    type: 'email',
    label: 'Other Emails',
    disableForForm: false,
    hasFeedback: true,
  },
  website_scm: {
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
