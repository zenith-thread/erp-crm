import { useEffect } from 'react';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  RedoOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import { generate as uniqueId } from 'shortid';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useDate } from '@/settings';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { selectLangDirection } from '@/redux/translate/selectors';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { useMoney } from '@/settings';

import { request } from '@/request';

const getNestedValue = (record, dataIndex) => {
  if (!dataIndex) return null;
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
      record
    );
  }
  return record[dataIndex];
};

function AddNewItem({ config }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [] }) {
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;
  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items: dataSource } = listResult;
  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const langDirection = useSelector(selectLangDirection);

  // 📌 FUNCTION TO EXPORT EXCEL
  const exportToExcel = async () => {
    try {
      // Wait for the promise to resolve
      const allDataResponse = await request.listAll({ entity });

      // Extract data from the response (adjust according to your response structure)
      const allData = allDataResponse?.result || allDataResponse;

      if (!allData || !Array.isArray(allData) || allData.length === 0) {
        console.warn('No data available to export.');
        return;
      }

      const formattedData = allData.map((record) => {
        const row = {};
        dataTableColumns.forEach((column) => {
          const dataIndex = column.dataIndex;
          let value = getNestedValue(record, dataIndex);

          // Handle date fields
          if (
            ['date', 'expiredDate', 'priceValidity'].some((field) => dataIndex?.includes(field))
          ) {
            value = value ? dayjs(value).format(dateFormat) : '-';
          }

          // Handle array fields
          if (Array.isArray(value)) {
            if (entity === 'quote') {
              value = value.map((item) => item?.product?.hs_code || '-').join(', ');
            } else if (entity === 'deliveryChallan') {
              value = value.map((item) => item?.product?.name || '-').join(', ');
            } else {
              value = value.join(', ');
            }
          }

          // Handle status translations
          if (['status', 'paymentStatus', 'deliveryStatus'].includes(dataIndex)) {
            value = value ? translate(value) : '-';
          }

          // Format currency for invoices
          if (entity === 'invoice' && ['total', 'credit'].includes(dataIndex)) {
            value = moneyFormatter({ amount: value, currency_code: record.currency });
          }

          row[column.title] = value ?? '-';
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, entity);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `${entity}_export.xlsx`);
    } catch (e) {
      console.error('Export to Excel failed:', error);
    }
  };

  // 📌 FUNCTION TO EXPORT PDF
  const exportToPDF = async () => {
    try {
      // Fetch all data using your listAll API endpoint
      const allDataResponse = await request.listAll({ entity });
      const allData = allDataResponse?.result || allDataResponse;

      if (!allData || !Array.isArray(allData) || allData.length === 0) {
        console.warn('No data available to export.');
        return;
      }

      const doc = new jsPDF('landscape');
      doc.text(`${translate(entity)} List`, 14, 10);

      const headers = dataTableColumns.map((col) => col.title);

      const rows = allData.map((record) =>
        dataTableColumns.map((column) => {
          const dataIndex = column.dataIndex;
          let value = getNestedValue(record, dataIndex);

          // Date handling
          if (
            ['date', 'expiredDate', 'priceValidity'].some((field) => dataIndex?.includes(field))
          ) {
            value = value ? dayjs(value).format(dateFormat) : '-';
          }

          // Array handling
          if (Array.isArray(value)) {
            if (entity === 'quote') {
              value = value.map((item) => item?.product?.hs_code || '-').join(', ');
            } else if (entity === 'deliveryChallan') {
              value = value.map((item) => item?.product?.name || '-').join(', ');
            } else {
              value = value.join(', ');
            }
          }

          // Status translations
          if (['status', 'paymentStatus', 'deliveryStatus'].includes(dataIndex)) {
            value = value ? translate(value) : '-';
          }

          // Currency formatting
          if (entity === 'invoice' && ['total', 'credit'].includes(dataIndex)) {
            value = moneyFormatter({ amount: value, currency_code: record.currency });
          }

          return value ?? '-';
        })
      );

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        styles: { fontSize: 8 },
        columnStyles: Object.fromEntries(
          headers.map((_, idx) => [idx, { cellWidth: 'auto', overflow: 'linebreak' }])
        ),
      });

      doc.save(`${entity}_export.pdf`);
    } catch (error) {
      console.error('Export to PDF failed:', error);
    }
  };

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record) => {
    const data = { ...record };
    dispatch(erp.currentAction({ actionType: 'update', data }));
    navigate(`/${entity}/update/${record._id}`);
  };
  const handleDownload = (record) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleRecordPayment = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/invoice/pay/${record._id}`);
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      key: 'action',
      fixed: 'left',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'recordPayment':
                  handleRecordPayment(record);
                  break;
                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const handelDataTableLoad = (pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(erp.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const filterTable = (value) => {
    const options = { equal: value, filter: searchConfig?.entity };
    dispatch(erp.list({ entity, options }));
  };

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        onBack={() => window.history.back()}
        backIcon={langDirection === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        extra={[
          <AutoCompleteAsync
            key={`${uniqueId()}`}
            entity={searchConfig?.entity}
            displayLabels={['name']}
            searchFields={'name'}
            onChange={filterTable}
            // redirectLabel={'Add New Client'}
            // withRedirect
            // urlToRedirect={'/customer'}
          />,
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,
          !disableAdd && <AddNewItem config={config} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
          direction: langDirection,
        }}
      >
        <Button
          type="primary"
          onClick={() => exportToExcel(entity, dataSource)}
          disabled={!dataSource || dataSource.length === 0}
        >
          📊 Export to Excel
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={() => exportToPDF(entity, dataSource)}
          disabled={!dataSource || dataSource.length === 0}
        >
          📄 Export to PDF
        </Button>
        ,
      </PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
