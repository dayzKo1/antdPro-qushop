import React, { Component } from 'react';
import { Card, Table, Row, Col, Select, Input, Button, DatePicker } from 'antd';
import { connect } from 'dva';
// import defaultImg from '@/assets/defaultImg.png';
// import { PageContainer } from '@ant-design/pro-layout';
import BasicHeader from '@/components/BasicHeader';
import TableFooter from '@/components/TableFooter';
import style from './styles.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
  ordersList: orders.ordersList,
  loading: loading.effects['orders/fetch'],
}))
class Order extends Component {
  state = {
    postStatus: undefined,
    fulfillmentStatus: undefined,
    date: undefined,
    search: undefined,

    currentPage: 1,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        page: 1,
      },
    });
  }

  // 订单状态筛选, wc-completed已完成，进行中(wc-pending待付款,wc-processing已付款)，wc-cancelled已取消，格式如:filter[status]=wc-completed
  changePostStatus = async (value) => {
    console.log('changePostStatus', value);
    const { dispatch } = this.props;
    const { fulfillmentStatus, date, search } = this.state;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        'filter[fulfillment_status]': fulfillmentStatus,
        'filter[status]': value,
        'filter[search]': search,
        'filter[date]': date,
      },
    });
    this.setState({
      postStatus: value,
    });
  };

  // 发货状态：未发货状态：unfulfilled,已发货状态：fulfilled，格式如:filter[fulfillment_status]=unfulfilled
  changeFulfillmentStatus = async (value) => {
    console.log('changeFulfillmentStatus', value);
    const { dispatch } = this.props;
    const { postStatus, date, search } = this.state;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        'filter[fulfillment_status]': value,
        'filter[status]': postStatus,
        'filter[search]': search,
        'filter[date]': date,
      },
    });
    this.setState({
      fulfillmentStatus: value,
    });
  };

  // 状态筛选
  changeStatus = async (value) => {
    console.log('changeStatus', value);
    const { dispatch } = this.props;
    const { tag, category, search } = this.state;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        'filter[search]': search,
        'filter[category]': category,
        'filter[tag]': tag,
        'filter[status]': value,
      },
    });
    this.setState({
      status: value,
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
    const { dispatch } = this.props;
    const { fulfillmentStatus, postStatus, search, date } = this.state;
    console.log('-search-', search);
    await dispatch({
      type: 'orders/fetch',
      payload: {
        'filter[fulfillment_status]': fulfillmentStatus,
        'filter[status]': postStatus,
        'filter[search]': search,
        'filter[date]': date,
      },
    });
  };

  // 搜索
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

  // 分页
  changePage = (page, prePage, type) => {
    console.log('params', page, prePage, type);
    this.setState({
      currentPage: page,
    });
  };

  render() {
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'number',
      },
      {
        title: '付款时间',
        dataIndex: 'paid_date',
      },
      {
        title: '订单状态',
        dataIndex: 'post_status',
        render: (v) => {
          switch (v) {
            case 'wc-completed':
              return <div className={[style.poststatus, style.wcCompleted].join(' ')}>已完成</div>;
            //  break;
            case 'wc-cancelled':
              return <div className={[style.poststatus, style.wcCancelled].join(' ')}>已取消</div>;
            //  break;
            default:
              return <div className={[style.poststatus, style.wcOthers].join(' ')}>进行中</div>;
          }
        },
      },
      {
        title: '发货状态',
        dataIndex: 'fulfillment_status',
        render: (v, r) => (
          <>
            {r.fulfillment_status === 'fulfilled' && (
              <div className={[style.fulfillmentStatus, style.fulfilled].join(' ')}>已发货</div>
            )}
            {r.fulfillment_status === 'unfulfilled' && (
              <div className={[style.fulfillmentStatus, style.unfulfilled].join(' ')}>未发货</div>
            )}
          </>
        ),
      },
      {
        title: '订单金额',
        dataIndex: 'order_total',
      },
      {
        title: '操作',
        // dataIndex: 'address',
        align: 'right',
        render: () => <div className={style.link}>编辑</div>,
      },
    ];

    const { loading, ordersList } = this.props;
    const { fulfillmentStatus, postStatus, search, currentPage } = this.state;

    return (
      // <PageContainer>
      <>
        <BasicHeader title="商品列表" />
        <Card className={style.cardbox}>
          <Row gutter={15} style={{ marginBottom: 10 }}>
            <Col span={4}>
              <Select
                style={{ width: '100%' }}
                showSearch
                value={postStatus}
                placeholder="选择订单状态"
                allowClear
                onChange={this.changePostStatus}
                onSearch={this.changeCategories}
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
                onSearch={this.changeFulfillmentStatus}
              >
                {/* <Option value="publish">全部发货状态</Option> */}
                <Option value="fulfilled">已发货</Option>
                <Option value="unfulfilled">未发货</Option>
              </Select>
            </Col>
            <Col span={4}>
              <RangePicker />
            </Col>
            <Col span={5}>
              <Input
                placeholder="请输入订单编号/支付编号/商品名/SKU/邮箱"
                allowClear
                value={search}
                onChange={this.saveSearch}
              />
            </Col>
            <Col span={5}>
              <Button type="primary" style={{ marginRight: 10 }} onClick={this.search}>
                {' '}
                查询
              </Button>
              <Button onClick={this.reset}>重置</Button>
            </Col>
          </Row>
          <Table
            loading={loading}
            pagination={false}
            rowKey={(r) => r.id}
            columns={columns}
            dataSource={ordersList.data}
          />
          <TableFooter
            total={ordersList.meta && ordersList.meta.total}
            changePage={this.changePage}
            currentPage={currentPage}
            perPage={ordersList.meta && ordersList.meta.per_page}
            showSizeChanger
            showQuickJumper
            changeShowSize={(page, prePage) => this.changePage(page, prePage, true)}
          />
        </Card>
        {/* // </PageContainer> */}
      </>
    );
  }
}

export default Order;
