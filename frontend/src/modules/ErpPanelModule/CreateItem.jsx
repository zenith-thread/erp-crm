import { useState, useEffect } from 'react';

import { Button, Tag, Form, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';

import useLanguage from '@/locale/useLanguage';

import { settingsAction } from '@/redux/settings/actions';
import { erp } from '@/redux/erp/actions';
import { selectCreatedItem } from '@/redux/erp/selectors';

import calculate from '@/utils/calculate';
import { generate as uniqueId } from 'shortid';
import dayjs from 'dayjs';
import Loading from '@/components/Loading';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import { selectLangDirection } from '@/redux/translate/selectors';

import { useBeforeUnload } from 'react-router-dom';

const serializeFormData = (formData) => {
  const dataToStore = JSON.parse(JSON.stringify(formData));

  delete dataToStore.people;

  if (dataToStore.items) {
    dataToStore.items = dataToStore.items
      .filter((item) => item !== null) // Remove null items
      .map(({ product, ...rest }) => rest);
  }

  return {
    ...dataToStore,
    date: formData.date?.isValid?.() ? formData.date.toISOString() : dayjs().toISOString(),
    priceValidity: formData.priceValidity?.isValid?.()
      ? formData.priceValidity.toISOString()
      : dayjs().add(7, 'days').toISOString(),
  };
};

function SaveForm({ form }) {
  const translate = useLanguage();
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('Save')}
    </Button>
  );
}

export default function CreateItem({ config, CreateForm }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);
  let { entity } = config;

  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalTransportCost, setTotalTransportCost] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState(0);

  useEffect(() => {
    const loadDraft = () => {
      const savedData = localStorage.getItem('draftQuote');
      if (!savedData) return;

      try {
        const parsedData = JSON.parse(savedData);
        const processedData = {
          ...parsedData,
          date: parsedData.date ? dayjs(parsedData.date) : dayjs(),
          priceValidity: parsedData.priceValidity
            ? dayjs(parsedData.priceValidity)
            : dayjs().add(7, 'days'),
        };

        // Set initial values instead of fields
        form.setFieldsValue(processedData);
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem('draftQuote');
      }
    };

    // Delay loading to ensure form is initialized
    const timeoutId = setTimeout(loadDraft, 100);
    return () => clearTimeout(timeoutId);
  }, [form]);

  const handelValuesChange = (changedValues, values) => {
    const items = values['items'];
    let subtotal = 0;
    let totalProductPrice = 0;
    let totalTransportCost = 0;
    let totalExpense = 0;
    let totalquantity = 0;

    if (items) {
      items.map((item) => {
        if (item) {
          if (item.ServiceCharge12Tax) {
            // Service Charge Calculation
            item['total'] = calculate.multiply(item['quantity'], item['price']);
            item['serviceChargesAmount'] = calculate.multiply(
              item['total'],
              item['ServiceCharge12Tax'] / 100
            );
            item['total'] = Math.ceil(calculate.add(item['total'], item['serviceChargesAmount']));

            // Quote Amount
            item['quoteAmount'] =
              item['quantity'] > 0 ? Math.round((item['total'] / item['quantity']) * 100) / 100 : 0;
          } else {
            // Individual Taxes Calculation
            item['total'] = calculate.multiply(item['quantity'], item['price']);
            item['total'] = calculate.add(item['total'], item['transportation']);
            item['total'] = calculate.add(item['total'], item['misc_expenses']);
            item['total'] = calculate.add(item['total'], (item['profit'] / 100) * item['total']);

            let preTaxCost = item['total'];
            preTaxCost = calculate.add(
              calculate.multiply(preTaxCost, item['individualTaxRate'] / 100),
              preTaxCost
            );
            preTaxCost = calculate.multiply(preTaxCost, item['individualTaxRate2'] / 100);

            item['total'] = Math.ceil(calculate.add(preTaxCost, item['total']));

            // Quote Amount
            item['quoteAmount'] =
              item['quantity'] > 0 ? Math.round((item['total'] / item['quantity']) * 100) / 100 : 0;
          }

          // Update aggregates
          subtotal = calculate.add(subtotal, item['total']);
          totalProductPrice = calculate.add(
            totalProductPrice,
            calculate.multiply(item['quantity'], item['price'])
          );
          totalTransportCost = calculate.add(totalTransportCost, item['transportation']);
          totalExpense = calculate.add(totalExpense, item['misc_expenses']);
          totalquantity = calculate.add(totalquantity, item['quantity']);
        }
      });

      setSubTotal(subtotal);
      setTotalProductPrice(totalProductPrice);
      setTotalTransportCost(totalTransportCost);
      setTotalExpense(totalExpense);
      setTotalQuantity(totalquantity);
    }
    // Handle date serialization
    const saveDraft = () => {
      const valuesToStore = serializeFormData(values);
      localStorage.setItem('draftQuote', JSON.stringify(valuesToStore));
    };

    const timeoutId = setTimeout(saveDraft, 300);
    return () => clearTimeout(timeoutId);
  };
  console.log(
    'AFTER SETTING ITEM QUOTE AMOUNT and CHECKING SERVICE CHARGE IN STATE: ',
    quoteAmount
  );

  // Update beforeunload handler
  useBeforeUnload(() => {
    const formData = form.getFieldsValue(true);
    const valuesToStore = serializeFormData(formData);
    localStorage.setItem('draftQuote', JSON.stringify(valuesToStore));
  });

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      setSubTotal(0);
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
      // Clear storage on successful submit
      localStorage.removeItem('draftQuote');
    }
    return () => {};
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (fieldsValue && fieldsValue.items) {
      const newList = fieldsValue.items.map((item) => {
        if (item.ServiceCharge12Tax) {
          // Service Charge Calculation
          item.total = calculate.multiply(item.quantity, item.price);
          item.serviceChargesAmount = calculate.multiply(item.total, item.ServiceCharge12Tax / 100);
          item.total = Math.ceil(calculate.add(item.total, item.serviceChargesAmount));
          item.quoteAmount = item.quantity ? (item.total / item.quantity).toFixed(2) : 0;
        } else {
          // Individual Taxes Calculation
          item.total = calculate.multiply(item.quantity, item.price);
          item.total = calculate.add(item.total, item.transportation);
          item.total = calculate.add(item.total, item.misc_expenses);
          item.total = calculate.add(item.total, (item.profit / 100) * item.total);

          let preTaxCost = item.total;
          preTaxCost = calculate.add(
            calculate.multiply(preTaxCost, item.individualTaxRate / 100),
            preTaxCost
          );
          preTaxCost = calculate.multiply(preTaxCost, item.individualTaxRate2 / 100);

          item.total = calculate.add(item.total, preTaxCost);
          item.quoteAmount = item.quantity ? (item.total / item.quantity).toFixed(2) : 0;
        }
        return item;
      });

      fieldsValue = {
        ...fieldsValue,
        items: newList,
        totalQuantity,
      };
    }

    dispatch(erp.create({ entity, jsonData: fieldsValue }));
  };
  const langDirection = useSelector(selectLangDirection);
  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        backIcon={langDirection === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        title={translate('New')}
        ghost={false}
        tags={<Tag>{translate('Draft')}</Tag>}
        // subTitle="This is create page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
          <CreateForm
            subTotal={subTotal}
            totalProductPrice={totalProductPrice}
            totalTransportCost={totalTransportCost}
            totalExpense={totalExpense}
          />
        </Form>
      </Loading>
    </>
  );
}
