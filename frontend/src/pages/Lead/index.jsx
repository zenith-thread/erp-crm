import dayjs from 'dayjs';
import { Tag } from 'antd';
import { tagColor } from '@/utils/statusTagColor';
import DeliveryChallanDataTableModule from '@/modules/DeliveryChallanModule/DeliveryChallanDataTableModule';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

export default function Quote() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'deliveryChallan';

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
      title: translate('DC #'),
      dataIndex: ['_id'],
      fixed: 'left',
    },

    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Client'),
      dataIndex: ['people', 'name'],
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
      title: translate('Destination'),
      dataIndex: ['people', 'address'],
    },
    {
      title: translate('Product'),
      dataIndex: ['items'],
      render: (items) => {
        // Extract all hs_code values from the items array
        const productName = items.map((item) => item.product.name).join(', ');

        return productName || '-'; // If no hs_code exists, show '-'
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
      title: translate('Remarks'),
      dataIndex: ['remarks'],
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('deliveryChallan'),
    DATATABLE_TITLE: translate('Delivery Challan_list'),
    ENTITY_NAME: translate('deliveryChallan'),
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
  return <DeliveryChallanDataTableModule config={config} />;
}
