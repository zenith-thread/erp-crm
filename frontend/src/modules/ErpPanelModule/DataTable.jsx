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
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;

  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;

  // 📌 FUNCTION TO EXPORT EXCEL
  const exportToExcel = (data = []) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No data available to export.');
      return;
    }

    console.log('Raw Data:', data); // Debugging

    const formattedData = data.map((record) => ({
      Year: record?.year || '-',
      Client: record?.people?.name || '-',
      'Quote Ref #': record?.number || '-',
      Date: record?.date ? dayjs(record.date).format(dateFormat) : '-',
      'Expiry Date': record?.priceValidity ? dayjs(record.priceValidity).format(dateFormat) : '-',
      'PR #': record?.ref || '-',
      Destination: record?.people?.address || '-',
      'HS Code': record?.items
        ? record.items.map((item) => item?.product?.hs_code || '-').join(', ')
        : '-',
      Quantity: record?.totalQuantity || '-',
      'Amount W/O GST': record?.subTotal || '-',
      'Quote Status': record?.quoteStatus || '-',
      'Delivery Status': record?.deliveryStatus || '-',
      'Purchase Order #': record?.po_number || '-',
    }));

    console.log('Formatted Data for Excel:', formattedData); // Debugging

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotes');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Quotes.xlsx');
  };

  // 📌 FUNCTION TO EXPORT PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
    doc.text('Quote List', 14, 10);

    const tableData = data.map((record) => [
      record.year,
      record.people?.name || '-',
      record.number,
      dayjs(record.date).format(dateFormat),
      dayjs(record.expiredDate).format(dateFormat),
      record.ref || '-',
      record.people?.address || '-',
      record.items.map((item) => item.product.hs_code).join(', ') || '-',
      record.totalQuantity,
      record.subTotal,
      record.quoteStatus,
      record.deliveryStatus,
      record.po_number || '-',
    ]);

    doc.autoTable({
      head: [
        [
          'Year',
          'Client',
          'Quote Ref #',
          'Date',
          'Expiry Date',
          'PR #',
          'Destination',
          'HS Code',
          'Quantity',
          'Amount W/O GST',
          'Quote Status',
          'Delivery Status',
          'Purchase Order #',
        ],
      ],
      body: tableData,
      startY: 20,
      columnStyles: {
        0: { cellWidth: 10, overflow: 'linebreak' }, // Year
        1: { cellWidth: 20, overflow: 'linebreak' }, // Client
        2: { cellWidth: 20, overflow: 'linebreak' }, // Quote Ref #
        3: { cellWidth: 20, overflow: 'linebreak' }, // Date
        4: { cellWidth: 20, overflow: 'linebreak' }, // Expiry Date
        5: { cellWidth: 20, overflow: 'linebreak' }, // PR #
        6: { cellWidth: 35, overflow: 'linebreak' }, // Destination
        7: { cellWidth: 20, overflow: 'linebreak' }, // HS Code
        8: { cellWidth: 20, overflow: 'linebreak' }, // Quantity
        9: { cellWidth: 25, overflow: 'linebreak' }, // Amount W/O GST
        10: { cellWidth: 20, overflow: 'linebreak' }, // Quote Status
        11: { cellWidth: 20, overflow: 'linebreak' }, // Delivery Status
        12: { cellWidth: 20, overflow: 'linebreak' }, // Purchase Order #
      },
      styles: {
        fontSize: 8, // Decrease font size
      },
    });

    doc.save('Quotes.pdf');
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

  const navigate = useNavigate();

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

  const dispatch = useDispatch();

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
  const langDirection = useSelector(selectLangDirection);

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
          onClick={() => exportToExcel(dataSource)}
          disabled={!dataSource || dataSource.length === 0}
        >
          📊 Export to Excel
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={() => exportToPDF(dataSource)}
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
