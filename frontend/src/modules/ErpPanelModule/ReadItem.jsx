import { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { Row, Col, Descriptions, Tag, Table } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { generate as uniqueId } from 'shortid';
import { selectCurrentItem } from '@/redux/erp/selectors';
import { useMoney, useDate } from '@/settings';
import { useNavigate } from 'react-router-dom';
import { tagColor } from '@/utils/statusTagColor';

const quoteColumns = [
  { title: 'Sr.#', dataIndex: 'sr', key: 'sr', width: 60 },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
  },
  { title: 'UOM', dataIndex: 'uom', key: 'uom', width: 100 },
  { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80 },
  { title: 'Unit Price (PKR)', dataIndex: 'unitPrice', key: 'unitPrice', width: 120 },
  { title: 'Amount (PKR)', dataIndex: 'amount', key: 'amount', width: 120 },
];

const challanColumns = [
  { title: 'Sr.#', dataIndex: 'sr', key: 'sr', width: 60 },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
  },
  { title: 'UOM', dataIndex: 'uom', key: 'uom', width: 100 },
  { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80 },
  { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 120 },
];

const invoiceColumns = [
  { title: 'Sr.#', dataIndex: 'sr', key: 'sr', width: 60 },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
  },
  { title: 'Unit Size', dataIndex: 'uom', key: 'uom', width: 100 },
  { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80 },
  { title: 'Unit Price (PKR)', dataIndex: 'unitPrice', key: 'unitPrice', width: 120 },
  { title: 'Value excluding GST', dataIndex: 'subtotal', key: 'subtotal', width: 150 },
  { title: 'GST %', dataIndex: 'taxRate', key: 'taxRate', width: 100 },
  { title: 'GST Amount', dataIndex: 'taxTotal', key: 'taxTotal', width: 120 },
  { title: 'Gross Amount (PKR)', dataIndex: 'total', key: 'total', width: 150 },
];

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const navigate = useNavigate();
  const { moneyFormatter } = useMoney();
  const { result: currentResult } = useSelector(selectCurrentItem);

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(selectedItem);

  useEffect(() => {
    console.log('READITEM.jsx yes : ', currentErp);
  }, [entity]);

  useEffect(() => {
    if (currentResult) {
      const { items, ...others } = currentResult;
      setItemsList(items || []);
      setCurrentErp(currentResult);
    }
  }, [currentResult]);

  const isChallan = entity === 'deliveryChallan';
  const isInvoice = entity === 'invoice';
  const columns = isInvoice ? invoiceColumns : isChallan ? challanColumns : quoteColumns;

  const tableData = itemslist.map((item, index) => {
    const baseItem = {
      key: item._id,
      sr: index + 1,
      description: `${item.product?.name}${item.description ? `<br/>${item.description}` : ''}`,
      uom: item.unit_size,
      qty: item.quantity,
    };
    if (isInvoice) {
      return {
        ...baseItem,
        unitPrice: moneyFormatter({ amount: item.unitPrice }),
        subtotal: moneyFormatter({ amount: item.subtotal }),
        gstPercent: `${item.gstPercent}%`,
        gstAmount: moneyFormatter({ amount: item.gstAmount }),
        total: moneyFormatter({ amount: item.total }),
      };
    }
    return isChallan
      ? {
          ...baseItem,
          remarks: item.remarks || '-',
        }
      : {
          ...baseItem,
          unitPrice: item.quoteAmount
            ? moneyFormatter({ amount: item.quoteAmount })
            : 'Sample Required',
          amount: item.total ? moneyFormatter({ amount: item.total }) : '-',
        };
  });

  const quoteSummary = [
    { label: 'Total:', value: currentErp.subTotal },
    { label: 'GST 18%:', value: currentErp.taxTotal },
    { label: 'Gross Amount (PKR):', value: currentErp.total },
  ];
  console.log('WATCHING CURRENTERP FOR INVOICE: ', currentErp);

  return (
    <>
      <PageHeader
        onBack={() => navigate(`/${entity}`)}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year}`}
        tags={[
          <Tag color={tagColor(currentErp.status)?.color} key="status">
            {translate(currentErp.status)}
          </Tag>,
        ]}
      >
        <Row justify="space-between" align="top" style={{ marginTop: '30px' }}>
          <Col span={12}>
            <Descriptions column={1} layout="horizontal" style={{ padding: 0 }}>
              <Descriptions.Item label="Client" style={{ padding: 0, paddingBottom: 8 }}>
                <strong>{currentErp.people.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Address" style={{ padding: 0, paddingBottom: 8 }}>
                {currentErp.people.address}
              </Descriptions.Item>
              {isInvoice && (
                <Descriptions.Item label="NTN" style={{ padding: 0 }}>
                  {currentErp.people.ntnNumber}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>

          {isChallan ? (
            <Col span={12}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content auto',
                  justifyContent: 'end',
                  fontSize: '14px',
                }}
              >
                <div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>DC Ref #:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>Date:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>PR #:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>PO #:</div>
                </div>
                <div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp._id}
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {new Date(currentErp.date).toLocaleDateString('en-GB')}
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.pr_number}
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.po_number}
                  </div>
                </div>
              </div>
            </Col>
          ) : isInvoice ? (
            <Col span={12}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content auto',
                  // gap: '8px 16px',
                  justifyContent: 'end',
                  fontSize: '14px',
                }}
              >
                <div style={{ textAlign: 'left', fontWeight: '600' }}>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>Invoice Ref #:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>Date:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>DC Ref #:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>PO #:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    SCM Solutions NTN
                  </div>
                </div>
                <div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp._id}
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {new Date(currentErp.date).toLocaleDateString('en-GB')}
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.dc_ref} || 9879879
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.po_number} || 987987987
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.scm.ntnNumber_scm} || 98798987
                  </div>
                </div>
              </div>
            </Col>
          ) : (
            <Col span={12}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content auto',
                  justifyContent: 'end',
                  fontSize: '14px',
                }}
              >
                <div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>Ref:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>Dated:</div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>PR #:</div>
                </div>

                <div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.number} || 123123
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {new Date(currentErp.date).toLocaleDateString('en-GB')}|| 1123123
                  </div>
                  <div style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                    {currentErp.pr_number}|| 1123123
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </PageHeader>
      <Divider dashed />
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        summary={() => {
          if (isChallan) return null; // No summary for challan
          if (isInvoice) return null; // No summary for invoice
          <Table.Summary>
            {quoteSummary.map((row, index) => (
              <Table.Summary.Row key={index}>
                <Table.Summary.Cell index={0} colSpan={5}>
                  {row.label}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {moneyFormatter({ amount: row.value })}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            ))}
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={6}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>- Price Validity: {currentErp.priceValidity?.split('T')[0]}</span>
                  <span>- Payment Terms: {currentErp.payment_terms}</span>
                  <span>- Delivery Term: {currentErp.delivery_terms}</span>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>;
        }}
      />
      {isInvoice && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Amount in words:</strong>
            <div>{currentErp.amountInWords}</div>
          </div>

          <Divider dashed />

          <div style={{ marginBottom: '2rem' }}>
            <h4>Bank Account Details:</h4>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Account Title">
                SCM Solutions (Private) Limited
              </Descriptions.Item>
              <Descriptions.Item label="Bank Name">
                Meezan Bank Limited, I-10 Branch, Islamabad
              </Descriptions.Item>
              <Descriptions.Item label="Branch Code">0307</Descriptions.Item>
              <Descriptions.Item label="Account No">107293067</Descriptions.Item>
              <Descriptions.Item label="IBAN">PK76MEZN0003070107293067</Descriptions.Item>
              <Descriptions.Item label="Swift Code">Meznpkkagrd</Descriptions.Item>
            </Descriptions>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <p>- The above prices are inclusive of WHT and Exclusive of all local duties/Taxes.</p>
            <p>- Payment Terms: {currentErp.payment_terms}</p>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'left' }}>
            <p>
              Thank you for giving us the opportunity to work with your esteemed organization. We
              hope to have the chance to serve you again soon. Assuring you of our best services all
              the times.
            </p>
          </div>
        </div>
      )}
      {isChallan ? (
        <div
          style={{
            marginTop: 30,
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '100%', fontSize: '16px' }}>
            <p>
              For <strong style={{ fontWeight: 'bolder' }}>SCM Solutions (Pvt.) Limited</strong>
            </p>
            <br />
            <p>Authorized Signatory</p>
          </div>
          <div style={{ marginLeft: '15rem', width: '60%', fontSize: '16px' }}>
            <p>
              The above mentioned material is received complete in all respect, in good and sound
              condition.
            </p>
            <p>Signature: _________________</p>
            <p>Name: _________________</p>
            <p>Dated: _________________</p>
          </div>
          <br />
        </div>
      ) : (
        <div style={{ marginTop: '3rem', textAlign: 'left', fontSize: '16px' }}>
          <p>Sincerely yours,</p>
          <p>
            <strong>SCM Solutions (Private) Limited</strong>
          </p>
          <br />
          <p>
            <strong>Muhammad Hanif</strong>
          </p>
          <p>MD & CEO</p>
        </div>
      )}
    </>
  );
}
