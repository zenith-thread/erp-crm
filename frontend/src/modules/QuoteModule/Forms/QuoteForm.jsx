import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { DatePicker } from 'antd';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';

import ItemRow from '@/modules/ErpPanelModule/ItemRow';

import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

import calculate from '@/utils/calculate';
import { useSelector } from 'react-redux';
import SelectAsync from '@/components/SelectAsync';
// import SelectCurrency from '@/components/SelectCurrency';

export default function QuoteForm({
  totalProductPrice = 0,
  totalTransportCost = 0,
  totalExpense = 0,
  subTotal = 0,
  current = null,
}) {
  const { last_quote_number } = useSelector(selectFinanceSettings);

  if (last_quote_number === undefined) {
    return <></>;
  }

  return (
    <LoadQuoteForm
      subTotal={subTotal}
      totalProductPrice={totalProductPrice}
      totalTransportCost={totalTransportCost}
      totalExpense={totalExpense}
      current={current}
    />
  );
}

function LoadQuoteForm({
  totalProductPrice = 0,
  totalTransportCost = 0,
  totalExpense = 0,
  subTotal = 0,
  current = null,
}) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { last_quote_number } = useSelector(selectFinanceSettings);
  const [lastNumber, setLastNumber] = useState(() => last_quote_number + 1);

  const [total, setTotal] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [taxRate2, setTaxRate2] = useState(0);
  const [taxTotal2, setTaxTotal2] = useState(0);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [quoteStatusValue, setQuoteStatusValue] = useState('pending');
  const [deliveryStatusValue, setDeliveryStatusValue] = useState('pending');

  let investmentTotal =
    totalProductPrice + totalTransportCost + totalExpense + taxTotal + taxTotal2;

  const handelTaxChange = (value) => {
    setTaxRate(value / 100);
  };
  const handelTaxChange2 = (value) => {
    setTaxRate2(value / 100);
  };

  useEffect(() => {
    if (current) {
      const { taxRate = 0, taxRate2 = 0, year, number } = current;
      setTaxRate(taxRate / 100);
      setTaxRate2(taxRate2 / 100);
      setCurrentYear(year);
      setLastNumber(number);
    }
    current && setQuoteStatusValue(current.quoteStatus);
    current && setDeliveryStatusValue(current.deliveryStatus);
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.add(calculate.multiply(subTotal, taxRate), subTotal);
    setTaxTotal(Number.parseFloat(calculate.multiply(subTotal, taxRate)));
    setTotal(Number.parseFloat(currentTotal));

    const currentInvestment = calculate.add(calculate.multiply(total, taxRate2), total);
    setTaxTotal2(Number.parseFloat(calculate.multiply(total, taxRate2)));
    setTotalInvestment(Number.parseFloat(currentInvestment));
  }, [subTotal, total, taxRate, taxRate2]);

  const addField = useRef(false);

  useEffect(() => {
    addField.current.click();
  }, []);

  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={7}>
          <Form.Item
            name="people"
            label={translate('People')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AutoCompleteAsync
              entity={'people'}
              displayLabels={['name']}
              searchFields={'name'}
              redirectLabel={'Add New People'}
              withRedirect
              urlToRedirect={'/people'}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={2}>
          <Form.Item
            label={translate('number')}
            name="number"
            initialValue={lastNumber}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            label={translate('year')}
            name="year"
            initialValue={currentYear}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* <Col className="gutter-row" span={6}>
          <SelectCurrency />
        </Col> */}
        <Col className="gutter-row" span={4}>
          <Form.Item
            label={translate('Quote Status')}
            name="quoteStatus"
            rules={[
              {
                required: false,
              },
            ]}
            initialValue={'pending'}
          >
            <Select
              options={[
                { value: 'draft', label: translate('Draft') },
                { value: 'pending', label: translate('Pending') },
                { value: 'sent', label: translate('Sent') },
                { value: 'approved', label: translate('Approved') },
                { value: 'declined', label: translate('Declined') },
                { value: 'cancelled', label: translate('Cancelled') },
                { value: 'on hold', label: translate('On Hold') },
              ]}
              onChange={(value) => {
                setQuoteStatusValue(value);
              }}
            ></Select>
          </Form.Item>
        </Col>
        {quoteStatusValue === 'approved' ? (
          <Col className="gutter-row" span={4}>
            <Form.Item
              label={translate('Delivery Status')}
              name="deliveryStatus"
              rules={[
                {
                  required: false,
                },
              ]}
              initialValue={'pending'}
            >
              <Select
                options={[
                  { value: 'draft', label: translate('Draft') },
                  { value: 'pending', label: translate('Pending') },
                  { value: 'delivered', label: translate('Delivered') },
                  { value: 'declined', label: translate('Declined') },
                  { value: 'cancelled', label: translate('Cancelled') },
                  { value: 'returned', label: translate('Returned') },
                  { value: 'on hold', label: translate('On Hold') },
                ]}
                onChange={(value) => {
                  setDeliveryStatusValue(value);
                }}
              ></Select>
            </Form.Item>
          </Col>
        ) : (
          ''
        )}
        {deliveryStatusValue === 'delivered' ? (
          <Col className="gutter-row" span={4}>
            <Form.Item
              label={translate('PO #')}
              name="po_number"
              initialValue={'0'}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        ) : (
          ''
        )}
        <Col className="gutter-row" span={4}>
          <Form.Item
            name="date"
            label={translate('Date')}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={4}>
          <Form.Item
            name="priceValidity"
            label={translate('Price Validity')}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs().add(7, 'days')}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={deliveryStatusValue === 'delivered' ? 6 : 10}>
          <Form.Item
            label={translate('Payment Terms')}
            name="payment_terms"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={quoteStatusValue === 'approved' ? 10 : 14}>
          <Form.Item
            label={translate('Delivery Terms')}
            name="delivery_terms"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Divider dashed />
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => {
              return <ItemRow key={field.key} remove={remove} field={field} current={current} />;
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addField}
              >
                {translate('Add field')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider dashed />
      <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={5}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                {translate('Save')}
              </Button>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4} offset={10}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('Sub Total')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={subTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectAsync
                value={taxRate}
                onChange={handelTaxChange}
                entity={'taxes'}
                outputValue={'taxValue'}
                displayLabels={['taxName']}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate('Add New Tax')}
                placeholder={translate('Select Tax Value')}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
                color: '#f56942',
                fontWeight: 'bold',
              }}
            >
              {translate('Total Quote Amount')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={total} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <Form.Item
              name="taxRate2"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <SelectAsync
                value={taxRate2}
                onChange={handelTaxChange2}
                entity={'taxes'}
                outputValue={'taxValue'}
                displayLabels={['taxName']}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate('Add New Tax')}
                placeholder={translate('Select Tax Value')}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal2} />
          </Col>
        </Row>

        {/* SUMMARY */}

        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                fontSize: '20px',
                paddingTop: '10px',
                paddingBottom: '15px',
                textAlign: 'left',
                margin: 0,
              }}
            >
              {translate('Summary')} :
            </p>
          </Col>
        </Row>
        {/* Product Price */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('Product Price')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={totalProductPrice} />
          </Col>
        </Row>

        {/* Total Transport Cost */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('Total Transport Cost')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={totalTransportCost} />
          </Col>
        </Row>

        {/* Expense */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('Total Expense')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={totalExpense} />
          </Col>
        </Row>
        {/* GST */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('GST')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row>
        {/* WTH */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('WTH')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal2} />
          </Col>
        </Row>

        {/* Total Investment */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
                color: '#1b98f5',
                fontWeight: 'bold',
              }}
            >
              {translate('Total Investment')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={investmentTotal} />
          </Col>
        </Row>

        {/* Net Profit */}
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {translate('Net Proft')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={total - investmentTotal} />
          </Col>
          <Col className="gutter-row" span={5} offset={19}>
            <InputNumber
              readOnly
              addonBefore="%"
              value={(((total - investmentTotal) / investmentTotal) * 100).toFixed(2)}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
