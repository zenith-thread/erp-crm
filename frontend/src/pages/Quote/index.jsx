import dayjs from 'dayjs';
import { Tag } from 'antd';
import { tagColor } from '@/utils/statusTagColor';
import QuoteDataTableModule from '@/modules/QuoteModule/QuoteDataTableModule';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import { useEffect, useState } from 'react';

export default function Quote() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'quote';

  const searchConfig = {
    entity: 'people',
    displayLabels: ['name'],
    searchFields: ['name'],
  };

  const deleteModalLabels = ['number', 'people.name'];
  const dataTableColumns = [
    {
      title: translate('Year'),
      dataIndex: 'year',
      fixed: 'left',
    },
    {
      title: translate('Client'),
      dataIndex: ['people', 'name'],
      fixed: 'left',
    },
    {
      title: translate('Quote Ref #'),
      dataIndex: ['_id'],
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
      dataIndex: ['pr_number'],
    },
    {
      title: translate('Destination'),
      dataIndex: ['people', 'address'],
    },
    {
      title: translate('HS Code'),
      dataIndex: ['items'],
      render: (items) => {
        // Extract all hs_code values from the items array
        const hsCodes = items.map((item) => item.product.hs_code).join(', ');

        return hsCodes || '-'; // If no hs_code exists, show '-'
      },
    },
    {
      title: translate('Quantity'),
      dataIndex: ['totalQuantity'],
    },
    {
      title: translate('Amount W/O GST'),
      dataIndex: 'subTotal',
    },
    {
      title: translate('Quote Status'),
      dataIndex: 'quoteStatus',
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
      title: translate('Delivery Status'),
      dataIndex: 'deliveryStatus',
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
      dataIndex: ['po_number'],
    },
    // {
    //   title: translate('Payment Status'),
    //   dataIndex: 'status',
    //   render: (status) => {
    //     let tagStatus = tagColor(status);

    //     return (
    //       <Tag color={tagStatus.color}>
    //         {/* {tagStatus.icon + ' '} */}
    //         {status && translate(tagStatus.label)}
    //       </Tag>
    //     );
    //   },
    // },
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
