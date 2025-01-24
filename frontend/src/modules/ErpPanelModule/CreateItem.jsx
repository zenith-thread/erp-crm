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

import Loading from '@/components/Loading';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import { selectLangDirection } from '@/redux/translate/selectors';

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
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  const handelValuesChange = (changedValues, values) => {
    const items = values['items'];
    let subTotal = 0;
    let totalProductPrice = 0;
    let totalTransportCost = 0;
    let totalExpense = 0;
    let subOfferTotal = 0;

    if (items) {
      items.map((item) => {
        if (item) {
          if (item.offerPrice && item.quantity) {
            let offerTotal = calculate.multiply(item['quantity'], item['offerPrice']);
            subOfferTotal = calculate.add(subOfferTotal, offerTotal);
          }
          if (item.quantity && item.price) {
            // Sub Total
            let total = calculate.multiply(item['quantity'], item['price']);
            total = calculate.add(total, item['transportation']);
            total = calculate.add(total, item['misc_expenses']);
            total = calculate.add(total, (item['profit'] / 100) * total);

            let preTaxCost = total;
            preTaxCost = calculate.add(
              calculate.multiply(preTaxCost, item['taxRate'] / 100),
              preTaxCost
            );
            preTaxCost = calculate.multiply(preTaxCost, item['taxRate2'] / 100);

            // TRY ADDING SUBTOTAL WITH TOTAL. SO PREPARE TOTAL FIRST WITH PRETAXCOST
            total = Math.ceil(calculate.add(preTaxCost, total));
            //sub total
            subTotal = calculate.add(subTotal, total);

            // Total Product Price
            let productPrice = calculate.multiply(item['quantity'], item['price']);
            totalProductPrice = calculate.add(totalProductPrice, productPrice);

            // Total Transport Cost
            totalTransportCost = calculate.add(totalTransportCost, item['transportation']);

            // Total Expense
            totalExpense = calculate.add(totalExpense, item['misc_expenses']);
          }
        }
      });
      setSubTotal(subTotal);
      setTotalProductPrice(totalProductPrice);
      setTotalTransportCost(totalTransportCost);
      setTotalExpense(totalExpense);
      setOfferSubTotal(subOfferTotal);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      setSubTotal(0);
      setOfferSubTotal(0);
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
    return () => {};
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (fieldsValue) {
      if (fieldsValue.items) {
        let newList = [...fieldsValue.items];
        newList.map((item) => {
          item.total = calculate.multiply(item.quantity, item.price);
          item.total = calculate.add(item.total, item.transportation);
          item.total = calculate.add(item.total, item.misc_expenses);
          item.total = calculate.add(item.total, (item.profit / 100) * subtotal);

          let preTaxCost = item.total;
          preTaxCost = calculate.add(
            calculate.multiply(preTaxCost, item.taxRate / 100),
            preTaxCost
          );
          preTaxCost = calculate.multiply(preTaxCost, item.taxRate2 / 100);

          item.total = calculate.add(item.total, preTaxCost);
        });
        fieldsValue = {
          ...fieldsValue,
          items: newList,
        };
      }
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
            offerTotal={offerSubTotal}
          />
        </Form>
      </Loading>
    </>
  );
}
