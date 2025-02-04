import { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Divider } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SelectAsync from '@/components/SelectAsync';

const MemoAutoComplete = memo(AutoCompleteAsync);
const MemoSelectAsync = memo(SelectAsync);

function ItemRow({ field, remove, current }) {
  const form = Form.useFormInstance();
  const money = useMoney();

  // const [isServiceChargeTaxApplied, setIsServiceChargeTaxApplied] = useState(false);
  // Get all field values at once
  const watchedValues = Form.useWatch([field.name], form) || {};
  // console.log('STATE VALUE: ', isServiceChargeTaxApplied);
  // Calculate total without side effects
  const total = useMemo(() => {
    let {
      quantity = 0,
      price = 0,
      transportation = 0,
      misc_expenses: miscExpenses = 0,
      profit = 0,
      individualTaxRate = 0,
      individualTaxRate2 = 0,
      ServiceCharge12Tax = 0,
      serviceChargesAmount = 0,
    } = watchedValues;

    try {
      if (!ServiceCharge12Tax) {
        let currentTotal = calculate.multiply(price, quantity);
        currentTotal = calculate.add(currentTotal, transportation);
        currentTotal = calculate.add(currentTotal, miscExpenses);
        currentTotal = calculate.add(currentTotal, currentTotal * (profit / 100));

        const tax1 = calculate.multiply(currentTotal, individualTaxRate / 100);
        const tax2 = calculate.multiply(
          calculate.add(currentTotal, tax1),
          individualTaxRate2 / 100
        );

        return Math.ceil(calculate.add(currentTotal, tax1, tax2));
      } else {
        let currentTotal = calculate.multiply(price, quantity);

        serviceChargesAmount = calculate.multiply(currentTotal, ServiceCharge12Tax / 100);
        return Math.ceil(calculate.add(currentTotal, serviceChargesAmount));
      }
    } catch (error) {
      return 0;
    }
  }, [watchedValues]);

  // Update form field after calculations
  useEffect(() => {
    const { quantity = 0 } = watchedValues;

    form.setFieldsValue({
      [field.name]: {
        ...watchedValues,
        total,
        quoteAmount: quantity ? (total / quantity).toFixed(2) : 0,
      },
    });
  }, [total]);

  // Value handler with proper decimal handling
  const createValueHandler = useCallback(
    (fieldName, factor = 1) => ({
      value: (watchedValues[fieldName] ?? 0) * factor,
      onChange: (value) => {
        const normalizedValue = typeof value === 'number' ? value / factor : 0;
        form.setFieldsValue({
          [field.name]: {
            ...watchedValues,
            [fieldName]: normalizedValue,
          },
        });
      },
    }),
    [form, field.name, watchedValues]
  );

  // Initial data load
  useEffect(() => {
    if (current) {
      const source = current.invoice?.[field.fieldKey] || current.items?.[field.fieldKey];
      if (source) {
        // Preserve existing values when loading
        form.setFieldsValue({
          [field.name]: {
            ...form.getFieldValue([field.name]), // Keep current values
            ...source, // Apply loaded values
            individualTaxRate: (source.individualTaxRate || 0) * 100,
            individualTaxRate2: (source.individualTaxRate2 || 0) * 100,
            ServiceCharge12Tax: (source.ServiceCharge12Tax || 0) * 100,
            profit: (source.profit || 0) * 100,
          },
        });
      }
    }
  }, [current]);

  return (
    <Row gutter={[12, 4]} style={{ position: 'relative' }}>
      <Col span={7}>
        <Form.Item
          name={[field.name, 'product']}
          label="Description"
          rules={[{ required: true, message: 'Description' }]}
        >
          <MemoAutoComplete
            entity="product"
            displayLabels={['name']}
            searchFields={['name', 'hs_code']}
            redirectLabel="Add New Product"
            withRedirect
            urlToRedirect="/product"
          />
        </Form.Item>
      </Col>

      <Col span={4}>
        <Form.Item name={[field.name, 'unit_size']} label="Unit Size">
          <Input />
        </Form.Item>
      </Col>

      <Col span={4}>
        <Form.Item name={[field.name, 'quantity']} label="Quantity" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={5}>
        <Form.Item name={[field.name, 'price']} label="Unit Price" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            controls={false}
            {...createValueHandler('price')}
            className="moneyInput"
            addonAfter={money.currency_position === 'after' && money.currency_symbol}
            addonBefore={money.currency_position === 'before' && money.currency_symbol}
          />
        </Form.Item>
      </Col>

      <Col span={4}>
        <Form.Item
          name={[field.name, 'transportation']}
          label="Transportation"
          rules={[{ required: false }]}
        >
          <InputNumber
            min={0}
            controls={false}
            {...createValueHandler('transportation')}
            className="moneyInput"
            addonAfter={money.currency_position === 'after' && money.currency_symbol}
            addonBefore={money.currency_position === 'before' && money.currency_symbol}
          />
        </Form.Item>
      </Col>

      <Col span={4}>
        <Form.Item
          name={[field.name, 'misc_expenses']}
          label="Misc. Expenses"
          rules={[{ required: false }]}
        >
          <InputNumber
            min={0}
            controls={false}
            {...createValueHandler('misc_expenses')}
            className="moneyInput"
            addonAfter={money.currency_position === 'after' && money.currency_symbol}
            addonBefore={money.currency_position === 'before' && money.currency_symbol}
          />
        </Form.Item>
      </Col>

      <Col span={3}>
        <Form.Item name={[field.name, 'profit']} label="Profit" rules={[{ required: false }]}>
          <InputNumber
            min={0}
            controls={false}
            {...createValueHandler('profit', 100)}
            className="moneyInput"
            addonBefore="%"
          />
        </Form.Item>
      </Col>

      <Col span={3}>
        <Form.Item
          name={[field.name, 'individualTaxRate']}
          label="GST"
          rules={[{ required: false }]}
        >
          <MemoSelectAsync
            {...createValueHandler('individualTaxRate', 100)}
            entity="taxes"
            outputValue="taxValue"
            displayLabels={['taxName']}
            withRedirect
            urlToRedirect="/taxes"
            redirectLabel="Add New Tax"
            placeholder="Select GST Tax"
          />
        </Form.Item>
      </Col>

      <Col span={3}>
        <Form.Item
          name={[field.name, 'individualTaxRate2']}
          label="WTH"
          rules={[{ required: false }]}
        >
          <MemoSelectAsync
            {...createValueHandler('individualTaxRate2', 100)}
            entity="taxes"
            outputValue="taxValue"
            displayLabels={['taxName']}
            withRedirect
            urlToRedirect="/taxes"
            redirectLabel="Add New Tax"
            placeholder="Select WTH Tax"
          />
        </Form.Item>
      </Col>

      <Col span={4}>
        <Form.Item
          name={[field.name, 'ServiceCharge12Tax']}
          label="Service Charge"
          rules={[{ required: false }]}
        >
          <MemoSelectAsync
            labelInValue // enable labelInValue mode
            {...createValueHandler('ServiceCharge12Tax', 100)}
            entity="taxes"
            outputValue="taxValue"
            displayLabels={['taxName']}
            withRedirect
            urlToRedirect="/taxes"
            redirectLabel="Add New Tax"
            placeholder="Select Service Charge"
            // onChange={(selected) => {
            //   const taxName = selected.label.props.children;
            //   if (taxName === 'Service Charge @12%') {
            //     setIsServiceChargeTaxApplied(true);
            //   } else {
            //     setIsServiceChargeTaxApplied(false);
            //   }
            // }}
          />
        </Form.Item>
      </Col>

      <Col span={7}>
        <Form.Item name={[field.name, 'total']} label=" ">
          <InputNumber
            readOnly
            value={total}
            className="moneyInput"
            addonBefore="Total"
            formatter={(value) =>
              money.amountFormatter({
                amount: value,
                currency_code: money.currency_code,
              })
            }
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={0} style={{ display: 'none' }}>
        <Form.Item name={[field.name, 'quoteAmount']} label="Unit Quote Amount">
          <Input />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={0} style={{ display: 'none' }}>
        <Form.Item name={[field.name, 'serviceChargesAmount']} label="Service Charge Amount">
          <Input />
        </Form.Item>
      </Col>
      {/* <Col className="gutter-row" span={4} style={{ display: 'block' }}>
        <Form.Item
          name={[field.name, 'isServiceChargeTaxApplied']}
          label="Is Service Charge Applied"
        >
          <Input readOnly value={isServiceChargeTaxApplied} />
        </Form.Item>
      </Col> */}

      <div style={{ position: 'absolute', right: '-20px', top: '80px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
      <Divider dashed />
    </Row>
  );
}

export default memo(ItemRow);
