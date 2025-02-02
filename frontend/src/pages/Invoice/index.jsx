import dayjs from 'dayjs';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const { moneyFormatter } = useMoney();

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
      title: translate('NTN'),
      dataIndex: ['people', 'ntnNumber'],
      fixed: 'left',
    },
    {
      title: translate('Invoice Ref #'),
      dataIndex: ['_id'],
      fixed: 'left',
    },
    {
      title: translate('Invoice Date'),
      dataIndex: 'date',
      fixed: 'left',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Invoice Status'),
      dataIndex: 'status',
      fixed: 'left',
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
      title: translate('Quote Ref #'),
      dataIndex: ['converted', 'quote'],
    },
    {
      title: translate('PR #'),
      dataIndex: ['pr_number'],
    },
    {
      title: translate('PPO #'),
      dataIndex: ['po_number'],
    },
    {
      title: translate('DC Ref #'),
      dataIndex: ['dcRef'],
    },
    {
      title: translate('Delivery Date'),
      dataIndex: 'delivery_date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Description'),
      dataIndex: ['items'],
      render: (items) => {
        // Extract all hs_code values from the items array
        const products = items.map((item) => item.product.name).join(', ');

        return products || '-'; // If no hs_code exists, show '-'
      },
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
      title: translate('Inv Amount'),
      dataIndex: ['items'],
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (items, record) => {
        const prices = items.map((item) => item.price * item.quantity).join(', ');

        return moneyFormatter({ amount: prices, currency_code: record.currency });
      },
    },
    {
      title: translate('Service Charges @12%'),
      dataIndex: ['items'],
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (items, record) => {
        const serviceChargeAmount = items.map((item) => item.serviceChargesAmount).join(', ');

        return moneyFormatter({ amount: serviceChargeAmount, currency_code: record.currency });
      },
    },
    {
      title: translate('Total Amount'),
      dataIndex: ['subtotal'],
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: translate('GST %'),
      dataIndex: ['taxRate'],
    },
    {
      title: translate('GST Amount'),
      dataIndex: ['taxTotal'],
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: translate('Gross Amount'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: translate('WTH %'),
      dataIndex: ['taxRate2'],
    },
    {
      title: translate('WTH Amount'),
      dataIndex: ['taxTotal2'],
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: translate('Net Receivable Amount'),
      dataIndex: ['payment'],
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let tagStatus = tagColor(paymentStatus);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {paymentStatus && translate(paymentStatus)}
          </Tag>
        );
      },
    },

    {
      title: translate('paid'),
      dataIndex: 'credit',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },

    {
      title: translate('Created By'),
      dataIndex: ['createdBy', 'name'],
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ENTITY_NAME: translate('invoice'),
    RECORD_ENTITY: translate('record_payment'),
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

  return <InvoiceDataTableModule config={config} />;
}
