import { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';
import dayjs from 'dayjs';
import { Button, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import calculate from '@/utils/calculate';
import { generate as uniqueId } from 'shortid';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import Loading from '@/components/Loading';
import { tagColor } from '@/utils/statusTagColor';

import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { settingsAction } from '@/redux/settings/actions';
// import { StatusTag } from '@/components/Tag';

function SaveForm({ form, translate }) {
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('update')}
    </Button>
  );
}

export default function UpdateItem({ config, UpdateForm }) {
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalTransportCost, setTotalTransportCost] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState(0);

  const resetErp = {
    quoteStatus: '',
    deliveryStatus: '',
    people: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      ntnNumner: '',
    },
    subTotal: 0,
    taxRate: 0,
    taxTotal: 0,
    total: 0,
    taxRate2: 0,
    taxTotal2: 0,
    credit: 0,
    number: 0,
    year: 0,
    po_number: 0,
    pr_number: 0,
    ServiceCharge12Tax: 0,
    serviceChargesAmount: 0,
    quoteAmount: 0,
    totalQuantity: 0,
  };

  const [currentErp, setCurrentErp] = useState(current ?? resetErp);

  const { id } = useParams();

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
  };

  const onSubmit = (fieldsValue) => {
    let dataToUpdate = { ...fieldsValue };
    if (fieldsValue) {
      if (fieldsValue.date || fieldsValue.priceValidity) {
        dataToUpdate.date = dayjs(fieldsValue.date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        dataToUpdate.priceValidity = dayjs(fieldsValue.priceValidity).format(
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        );
      }
      if (fieldsValue.items) {
        let newList = [];
        fieldsValue.items.map((item) => {
          let {
            quantity,
            individualTaxRate,
            individualTaxRate2,
            price,
            product,
            description,
            misc_expenses,
            transportation,
            profit,
            unit_size,
            quoteAmount,
            ServiceCharge12Tax,
            serviceChargesAmount,
            total,
          } = item;
          if (ServiceCharge12Tax) {
            // Service Charge Calculation
            total = calculate.multiply(quantity, price);
            serviceChargesAmount = calculate.multiply(total, ServiceCharge12Tax / 100);
            total = Math.ceil(calculate.add(total, serviceChargesAmount));
            quoteAmount = quantity ? (total / quantity).toFixed(2) : 0;
          } else {
            total = quantity * price;
            total = total + transportation;
            total = total + misc_expenses;
            total = total + (profit / 100) * total;

            let preTaxCost = total;
            preTaxCost = (individualTaxRate / 100) * preTaxCost + total;
            preTaxCost = preTaxCost * (individualTaxRate2 / 100);
            total = Math.ceil(preTaxCost + total);
            quoteAmount = quantity ? (total / quantity).toFixed(2) : 0;
          }
          newList.push({
            total,
            quantity,
            individualTaxRate,
            individualTaxRate2,
            price,
            product,
            description,
            transportation,
            misc_expenses,
            profit,
            unit_size,
            quoteAmount,
          });
        });
        dataToUpdate.items = newList;
      }
    }

    dispatch(erp.update({ entity, id, jsonData: dataToUpdate }));
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setSubTotal(0);
      dispatch(erp.resetAction({ actionType: 'update' }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      setCurrentErp(current);
      let formData = { ...current };
      if (formData.date) {
        formData.date = dayjs(formData.date);
      }
      if (formData.priceValidity && dayjs(formData.priceValidity).isValid()) {
        formData.priceValidity = dayjs(formData.priceValidity);
      }
      if (!formData.taxRate) {
        formData.taxRate = 0;
      }

      const { subTotal } = formData;

      form.resetFields();
      form.setFieldsValue(formData);
      setSubTotal(subTotal);
    }
  }, [current]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={translate('update')}
        ghost={false}
        tags={[
          <Tag color={tagColor(currentErp.quoteStatus)?.color} key="quoteStatus">
            {currentErp.quoteStatus && translate(currentErp.quoteStatus)}
          </Tag>,
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm translate={translate} form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
          <UpdateForm
            subTotal={subTotal}
            totalProductPrice={totalProductPrice}
            totalTransportCost={totalTransportCost}
            totalExpense={totalExpense}
            current={current}
          />
        </Form>
      </Loading>
    </>
  );
}
