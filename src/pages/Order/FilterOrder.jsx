import React, { Component } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import styles from './styles.less';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
  query: orders.query,
  loading: loading.effects['orders/fetch'],
}))
class FilterOrder extends Component {
  formRef = React.createRef();

  state = {
    postStatus: undefined,
    fulfillmentStatus: undefined,
    date: undefined,
    search: undefined,
    currentPage: 1,
  };

  // 订单状态筛选, wc-completed已完成，进行中(wc-pending待付款,wc-processing已付款)，wc-cancelled已取消，格式如:filter[status]=wc-completed
  changePostStatus = async (value) => {
    const { dispatch, query, clearBatchSelect } = this.props;
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
    clearBatchSelect();
  };

  // 发货状态：未发货状态：unfulfilled,已发货状态：fulfilled，格式如:filter[fulfillment_status]=unfulfilled
  changeFulfillmentStatus = async (value) => {
    const { dispatch, query, clearBatchSelect } = this.props;
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
    clearBatchSelect();
  };

  // 时间筛选
  changeDate = async (_, dateStrings) => {
    const date =
      dateStrings[0] && dateStrings[1] ? `${dateStrings[0]},${dateStrings[1]}` : undefined;
    const { dispatch, query, clearBatchSelect } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        'filter[date]': date,
      },
      save: true,
    });
    this.setState({
      date,
    });
    clearBatchSelect();
  };

  // 保存商品名或SKU搜索信息
  saveSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  // 商品名或SKU搜索
  search = async (search) => {
    const { dispatch, query, clearBatchSelect } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        'filter[search]': search,
      },
      save: true,
    });
    clearBatchSelect();
  };

  // 重置搜索
  reset = async () => {
    this.formRef.current.resetFields();
    const { dispatch, clearBatchSelect } = this.props;
    await dispatch({
      type: 'orders/fetch',
      save: true,
    });
    this.setState({
      fulfillmentStatus: undefined,
      postStatus: undefined,
      search: undefined,
      date: undefined,
      currentPage: 1,
    });
    clearBatchSelect();
  };

  render() {
    const { loading } = this.props;
    const { fulfillmentStatus, postStatus, search } = this.state;
    return (
      <Form ref={this.formRef} style={{ height: 42 }}>
        <Row gutter={5} style={{ marginBottom: 10 }}>
          <Col span={3}>
            <Form.Item name="postStatus">
              <Select
                style={{ width: '100%' }}
                showSearch
                value={postStatus}
                placeholder="全部订单状态"
                allowClear
                onChange={this.changePostStatus}
              >
                {/* <Option value="publish">全部订单状态</Option> */}
                <Option value="wc-pending,wc-processing,wc-refunded">进行中</Option>
                <Option value="wc-completed">已完成</Option>
                <Option value="wc-cancelled">已取消</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="fulfillmentStatus">
              <Select
                showSearch
                style={{ width: '100%' }}
                value={fulfillmentStatus}
                placeholder="全部发货状态"
                allowClear
                onChange={this.changeFulfillmentStatus}
              >
                {/* <Option value="publish">全部发货状态</Option> */}
                <Option value="fulfilled">已发货</Option>
                <Option value="unfulfilled">未发货</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="date">
              <RangePicker locale={locale} style={{ width: '100%' }} onChange={this.changeDate} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="search">
              <Search
                placeholder="请输入订单编号/支付编号/商品名/SKU/邮箱"
                className={styles.search}
                allowClear
                value={search}
                onChange={this.saveSearch}
                onSearch={this.search}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => this.search(search)}
              loading={loading}
            >
              {' '}
              查询
            </Button>
            <Button onClick={this.reset} loading={loading}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterOrder;
