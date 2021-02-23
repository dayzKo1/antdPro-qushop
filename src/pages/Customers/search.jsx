import React, { useEffect } from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker } from 'antd';
// import Grid from '@/components/Grid';
import { connect } from 'dva';
import moment from 'moment';
// import style from "./style.less"
const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/zh.json'));
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const Searchs = (props) => {
  const [form] = Form.useForm();

  const { dispatch, query, currentPage, loading, countryList } = props;

  useEffect(async () => {
    await dispatch({
      type: 'customers/queryCountries',
    });
  }, []);

  const handleSubmit = ({ search }) => {
    dispatch({
      type: 'customers/queryCustomers',
      payload: {
        ...query,
        filter: {
          ...query?.filter,
          search: search || undefined,
        },
      },
    });
  };
  const resetting = () => {
    form.resetFields();
    dispatch({
      type: 'customers/queryCustomers',
      payload: {
        page: currentPage,
        sort: query?.sort || undefined,
      },
    });
  };
  const handleChange = (e, type) => {
    dispatch({
      type: 'customers/queryCustomers',
      payload: {
        ...query,
        filter: {
          ...query.filter,
          [type]: e,
        },
      },
    });
  };

  const changeDate = (_, dates) => {
    const after = (dates[0] !== '' && moment(dates[0]).format('YYYY-MM-DD ')) || undefined;
    const before =
      (dates[1] !== '' && moment(dates[1]).add(1, 'days').format('YYYY-MM-DD ')) || undefined;
    dispatch({
      type: 'customers/queryCustomers',
      payload: {
        ...query,
        filter: {
          ...query.filter,
          date: dates[0] ? [after, before] : undefined,
        },
      },
    });
    // backPageOne();
    // clearSelRowKeys();
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={{ xxl: 16, xl: 8, lg: 8 }} style={{ display: 'flex' }}>
          <Col>
            <Form.Item name="sub">
              <Select
                style={{ width: 140 }}
                placeholder="全部订阅状态"
                allowClear
                onChange={(e) => handleChange(e, 'subscribed')}
              >
                <Select.Option value={1}>已订阅</Select.Option>
                <Select.Option value={0}>未订阅</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="address">
              <Select
                style={{ width: 140 }}
                placeholder="全部地区"
                allowClear
                onChange={(e) => handleChange(e, 'country')}
              >
                {countryList?.map((o) => (
                  <Select.Option value={`${o.code}`} key={`${o.code}`}>
                    {countries.getName(o.code, 'zh')}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ width: '230px' }}>
            <Form.Item name="time">
              <DatePicker.RangePicker onChange={changeDate} />
            </Form.Item>
          </Col>
          <Col style={{ flex: 'auto' }}>
            <Form.Item name="search">
              <Input placeholder="请输入姓名/邮箱/手机" />
            </Form.Item>
          </Col>
          <Col>
            <Button loading={loading} type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
          <Col>
            <Button loading={loading} onClick={() => resetting()}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect((state) => ({
  query: state.customers.query,
  countryList: state.customers.countryList,
  loading: state.loading.effects['customers/queryCustomers'],
}))(Searchs);
