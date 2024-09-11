import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Divider } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';

export default function ItemRow({ field, remove, current = null }) {
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [miscExpenses, setMiscExpenses] = useState(0);
  const [profit, setProfit] = useState(0);

  const [totalState, setTotal] = useState(undefined);

  const money = useMoney();

  const updateQt = (value) => {
    setQuantity(value);
  };
  const updatePrice = (value) => {
    setPrice(value);
  };
  const updateTransportation = (value) => {
    setTransportation(value);
  };
  const updateMiscExpenses = (value) => {
    setMiscExpenses(value);
  };
  const updateProfit = (value) => {
    value = value / 100;
    setProfit(value);
  };

  useEffect(() => {
    if (current) {
      // When it accesses the /payment/ endpoint,
      // it receives an invoice.item instead of just item
      // and breaks the code, but now we can check if items exists,
      // and if it doesn't we can access invoice.items.

      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
          setTransportation(item.transportation);
          setMiscExpenses(item.miscExpenses);
          setProfit(item.profit);
        }
      } else {
        const item = items[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
          setTransportation(item.transportation);
          setMiscExpenses(item.miscExpenses);
          setProfit(item.profit);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    let currentTotal = calculate.multiply(price, quantity);
    currentTotal = calculate.add(currentTotal, transportation);
    currentTotal = calculate.add(currentTotal, miscExpenses);
    currentTotal = calculate.add(currentTotal, currentTotal * profit);

    setTotal(currentTotal);
  }, [price, quantity, transportation, miscExpenses, profit]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'product']}
          label="Product"
          rules={[
            {
              required: true,
              message: 'Please select a product',
            },
          ]}
        >
          <AutoCompleteAsync
            entity={'product'}
            displayLabels={['name']}
            searchFields={'name'}
            outputValue={'name'}
            redirectLabel={'Add New Product'}
            withRedirect
            urlToRedirect={'/product'}
          />
        </Form.Item>
      </Col>
      {/* <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          label="Product"
          rules={[
            {
              required: true,
              message: 'Missing itemName name',
            },
            {
              pattern: /^(?!\s*$)[\s\S]+$/, // Regular expression to allow spaces, alphanumeric, and special characters, but not just spaces
              message: 'Item Name must contain alphanumeric or special characters',
            },
          ]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
      </Col> */}
      <Col className="gutter-row" span={10}>
        <Form.Item name={[field.name, 'description']} label="Description">
          <Input />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'unit_size']} label="Unit Size">
          <Input />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]} label="Quantity">
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'price']} rules={[{ required: true }]} label="Unit Price">
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'transportation']}
          rules={[{ required: true }]}
          label="Transportation"
        >
          <InputNumber
            className="moneyInput"
            onChange={updateTransportation}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'misc_expenses']}
          rules={[{ required: false }]}
          label="Misc. Expenses"
        >
          <InputNumber
            className="moneyInput"
            onChange={updateMiscExpenses}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'profit']} rules={[{ required: true }]} label="Profit">
          <InputNumber
            className="moneyInput"
            onChange={updateProfit}
            min={0}
            controls={false}
            addonBefore="%"
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={7}>
        <Form.Item name={[field.name, 'total']} label=" ">
          <Form.Item>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              addonBefore="Total"
              formatter={(value) =>
                money.amountFormatter({ amount: value, currency_code: money.currency_code })
              }
            />
          </Form.Item>
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 80px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
      <Divider dashed />
    </Row>
  );
}
