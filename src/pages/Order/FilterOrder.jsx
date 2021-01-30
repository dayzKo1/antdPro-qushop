import React, { Component } from 'react';
import { Row, Col, Select, Input, Button, DatePicker } from 'antd';
import { connect } from 'dva';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
  query: orders.query,
  loading: loading.effects['orders/fetch'],
}))
class FilterOrder extends Component {
  state = {
    postStatus: undefined,
    fulfillmentStatus: undefined,
    date: undefined,
    search: undefined,
    currentPage: 1,
  };

  async componentDidMount() {
    const query = JSON.parse(sessionStorage.getItem('orderQuery')) || {};
    this.setState({
      postStatus: query['filter[status]'],
      fulfillmentStatus: query['filter[fulfillment_status]'],
      date: query['filter[date]'],
      search: query['filter[search]'],
    });
  }

  // 订单状态筛选, wc-completed已完成，进行中(wc-pending待付款,wc-processing已付款)，wc-cancelled已取消，格式如:filter[status]=wc-completed
  changePostStatus = async (value) => {
    console.log('changePostStatus', value);
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        'filter[status]': value,
      },
      save: true,
    });
    this.setState({
      postStatus: value,
    });
  };

  // 发货状态：未发货状态：unfulfilled,已发货状态：fulfilled，格式如:filter[fulfillment_status]=unfulfilled
  changeFulfillmentStatus = async (value) => {
    console.log('changeFulfillmentStatus', value);
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        'filter[fulfillment_status]': value,
      },
      save: true,
    });
    this.setState({
      fulfillmentStatus: value,
    });
  };

  // 时间筛选
  changeDate = async (dates, dateStrings) => {
    console.log('dates: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        'filter[date]': `${dateStrings[0]},${dateStrings[1]}`,
      },
      save: true,
    });
    this.setState({
      data: `${dateStrings[0]},${dateStrings[1]}`,
    });
  };

  // 保存商品名或SKU搜索信息
  saveSearch = (e) => {
    console.log(e.target.value);
    this.setState({
      search: e.target.value,
    });
  };

  // 商品名或SKU搜索
  search = async () => {
    const { dispatch, query } = this.props;
    const { search } = this.state;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        'filter[search]': search,
      },
      save: true,
    });
  };

  // 重置搜索
  reset = async () => {
    const { dispatch } = this.props;
    await dispatch({ type: 'orders/fetch' });
    this.setState({
      fulfillmentStatus: undefined,
      postStatus: undefined,
      search: undefined,
      date: undefined,
      currentPage: 1,
    });
  };

  render() {
    // const { loading, ordersList } = this.props;
    const { fulfillmentStatus, postStatus, date, search } = this.state;

    return (
      <Row gutter={5} style={{ marginBottom: 10 }}>
        <Col span={4}>
          <Select
            style={{ width: '100%' }}
            showSearch
            value={postStatus}
            placeholder="选择订单状态"
            allowClear
            onChange={this.changePostStatus}
          >
            {/* <Option value="publish">全部订单状态</Option> */}
            <Option value="wc-pending,wc-processing,wc-refunded">进行中</Option>
            <Option value="wc-completed">已完成</Option>
            <Option value="wc-cancelled">已取消</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Select
            showSearch
            style={{ width: '100%' }}
            value={fulfillmentStatus}
            placeholder="选择发货状态"
            allowClear
            onChange={this.changeFulfillmentStatus}
          >
            {/* <Option value="publish">全部发货状态</Option> */}
            <Option value="fulfilled">已发货</Option>
            <Option value="unfulfilled">未发货</Option>
          </Select>
        </Col>
        <Col span={6}>
          <RangePicker locale={locale} defaultValue={date} onChange={this.changeDate} />
        </Col>
        <Col span={5}>
          <Search
            placeholder="请输入订单编号/支付编号/商品名/SKU/邮箱"
            allowClear
            value={search}
            onChange={this.saveSearch}
            onSearch={this.search}
          />
        </Col>
        <Col span={4}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={this.search}>
            {' '}
            查询
          </Button>
          <Button onClick={this.reset}>重置</Button>
        </Col>
      </Row>
    );
  }
}

export default FilterOrder;
