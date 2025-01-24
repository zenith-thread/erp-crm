import useLanguage from '@/locale/useLanguage';
import CrudModule from '@/modules/CrudModule/CrudModule';
import EmployeeForm from '@/forms/EmployeeForm';
import dayjs from 'dayjs';
import { useDate } from '@/settings';
export default function Employee() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'employee';
  const searchConfig = {
    displayLabels: ['firstname', 'lastname'],
    searchFields: 'firstname,lastname',
    outputValue: '_id',
  };

  const deleteModalLabels = ['fistname', 'lastname'];

  const dataTableColumns = [
    {
      title: translate('first name'),
      dataIndex: 'firstname',
    },
    {
      title: translate('last name'),
      dataIndex: 'lastname',
    },
    {
      title: translate('Birthday'),
      dataIndex: 'birthday',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('gender'),
      dataIndex: 'gender',
    },
    {
      title: translate('Department'),
      dataIndex: 'department',
    },
    {
      title: translate('Position'),
      dataIndex: 'position',
    },
    {
      title: translate('Phone'),
      dataIndex: 'phone',
    },
    {
      title: translate('Email'),
      dataIndex: 'email',
    },
    {
      title: translate('Password'),
      dataIndex: 'password', // Make sure this is directly referencing the `password` field
      render: (password) => {
        console.log('Password:', password); // This will log the password value
        return password || translate('N/A');
      },
    },
  ];

  const readColumns = [
    {
      title: translate('first name'),
      dataIndex: 'firstname',
    },
    {
      title: translate('last name'),
      dataIndex: 'lastname',
    },
    {
      title: translate('Birth day'),
      dataIndex: 'birthday',
      isDate: true,
    },
    {
      title: translate('gender'),
      dataIndex: 'gender',
    },
    {
      title: translate('Phone'),
      dataIndex: 'phone',
    },
    {
      title: translate('Email'),
      dataIndex: 'email',
    },
    {
      title: translate('Department'),
      dataIndex: 'department',
    },
    {
      title: translate('Position'),
      dataIndex: 'position',
    },
    {
      title: translate('Address'),
      dataIndex: 'address',
    },
    {
      title: translate('State'),
      dataIndex: 'state',
    },
    {
      title: translate('Password'),
      dataIndex: 'password', // Make sure this is directly referencing the `password` field
      render: (password) => {
        console.log('Password:', password); // This will log the password value
        return password || translate('N/A');
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('Employee'),
    DATATABLE_TITLE: translate('Employee_list'),
    ADD_NEW_ENTITY: translate('add_new_Employee'),
    ENTITY_NAME: translate('Employee'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<EmployeeForm />}
      updateForm={<EmployeeForm isUpdateForm={true} />}
      config={config}
    />
  );
}
