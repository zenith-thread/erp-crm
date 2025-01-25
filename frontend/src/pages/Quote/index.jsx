import dayjs from 'dayjs';
import { Tag } from 'antd';
import { tagColor } from '@/utils/statusTagColor';
import QuoteDataTableModule from '@/modules/QuoteModule/QuoteDataTableModule';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

export default function Quote() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'quote';

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: ['name'],
  };
  const deleteModalLabels = ['number', 'client.name'];
  const dataTableColumns = [
    {
      title: translate('Year'),
      dataIndex: 'year',
      fixed: 'left',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
      fixed: 'left',
    },
    {
      title: translate('Quote Ref #'),
      dataIndex: ['number'],
      fixed: 'left',
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
      fixed: 'left',
    },
    {
      title: translate('expiry Date'),
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('PR #'),
      dataIndex: ['ref'],
    },
    {
      title: translate('Destination'),
      dataIndex: ['address'],
    },
    {
      title: translate('Description'),
      dataIndex: ['ref'],
      width: 300,
    },
    {
      title: translate('HS Code'),
      dataIndex: ['number'],
    },
    {
      title: translate('Quantity'),
      dataIndex: ['quantity'],
    },
    {
      title: translate('Amount W/O GST'),
      dataIndex: ['quantity'],
    },
    {
      title: translate('Feedback'),
      dataIndex: 'status',
      render: (status) => {
        let tagStatus = tagColor(status);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {status && translate(tagStatus.label)}
          </Tag>
        );
      },
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        let tagStatus = tagColor(status);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {status && translate(tagStatus.label)}
          </Tag>
        );
      },
    },
    {
      title: translate('Purchase Order #'),
      dataIndex: ['address'],
    },
    {
      title: translate('Invoice #'),
      dataIndex: ['address'],
    },
    {
      title: translate('Vendor Name'),
      dataIndex: ['address'],
    },
    {
      title: translate('Vendor Inv #'),
      dataIndex: ['address'],
    },
    {
      title: translate('Payment Status'),
      dataIndex: 'status',
      render: (status) => {
        let tagStatus = tagColor(status);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {status && translate(tagStatus.label)}
          </Tag>
        );
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('quote'),
    DATATABLE_TITLE: translate('quote_list'),
    ADD_NEW_ENTITY: translate('add_new_quote'),
    ENTITY_NAME: translate('quote'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <QuoteDataTableModule config={config} />;
}
