import React, { Component } from 'react';
import { Card, Table, Badge } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import currencyFormatter from 'currency-formatter';
import BasicHeader from '@/components/BasicHeader';
import TableFooter from '@/components/TableFooter';
import FilterOrder from './FilterOrder';
import BatchSelect from './BatchSelect';
import momentTimezone from 'moment-timezone';
import style from './styles.less';
import styles from '@/global.less';

@connect(({ orders, loading }) => ({
  ordersList: orders.ordersList,
  query: orders.query,
  loading: loading.effects['orders/fetch'],
}))
class Order extends Component {
  state = {
    postStatus: undefined,
    fulfillmentStatus: undefined,
    date: undefined,
    search: undefined,
    batchSel: false,
    selectedRowKeys: [],
    selectedRows: [],
    currentPage: 1,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    // const query = JSON.parse(sessionStorage.getItem('orderQuery')) || {};
    await dispatch({
      type: 'orders/fetch',
      payload: {
        page: 1,
        // ...query,
      },
      save: true,
    });
  }

  async componentWillUnmount() {
    sessionStorage.removeItem('orderQuery');
  }

  // 分页
  changePage = async (page, prePage) => {
    const { dispatch, query } = this.props;
    await dispatch({
      type: 'orders/fetch',
      payload: {
        ...query,
        page,
        page_size: prePage,
      },
      save: true,
    });
    this.setState({
      currentPage: page,
    });
  };

  // 多选
  batchSelect = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys.length) {
      this.setState({
        batchSel: true,
      });
    } else {
      this.setState({
        batchSel: false,
      });
    }
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 清除多选
  clearBatchSelect = () => {
    this.setState({
      batchSel: false,
      selectedRowKeys: [],
    });
  };

  // 更新数据
  updateData = async () => {
    const { dispatch, query } = this.props;
    // const query = JSON.parse(sessionStorage.getItem('proQuery')) || {};
    await dispatch({
      type: 'orders/fetch',
      payload: {
        page: 1,
        ...query,
      },
      save: true,
    });
  };

  // changeBetch
  changeBetch = () => {
    const { batchSel } = this.state;
    this.setState({
      batchSel: !batchSel,
    });
  };

  // 点击行
  clickRow = (r) => {
    if (!window.getSelection().toString()) {
      history.push(`/order/detail/${r.ID}`);
    }
  };

  // 转换订单时间
  changeTime = (times) => {
    // const { settingBase } = this.props;
    const settingBase = {
      timezone_string: 'Asia/Shanghai',
    };
    const t =
      times &&
      momentTimezone(times)
        .tz(settingBase.timezone_string || momentTimezone.tz.guess())
        .format('YYYY-MM-DD HH:mm:ss');
    // const t = times && momentTimezone(times).tz( || momentTimezone.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
    const result = (times && t) || '--';
    // console.log(result)
    return result;
  };

  render() {
    const { loading, ordersList, query } = this.props;
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'number',
      },
      {
        title: '付款时间',
        dataIndex: 'paid_date_gmt',
        render: (v) => v && this.changeTime(v),
      },
      {
        title: '订单状态',
        dataIndex: 'post_status',
        render: (v) => {
          switch (v) {
            case 'wc-completed':
              return <Badge status="success" text="已完成" />;
            //  break;
            case 'wc-cancelled':
              return <Badge status="error" text="已取消" />;
            //  break;
            default:
              return <Badge status="processing" text="进行中" />;
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
        render: (v, r) => (
          <div>{`${currencyFormatter?.findCurrency(r?.order_currency)?.symbol || '$'} ${v}`}</div>
        ),
      },
      {
        title: '操作',
        // dataIndex: 'address',
        align: 'right',
        render: (_, v) => (
          <a style={{ padding: '10px 0 10px 10px' }} onClick={() => this.clickRow(v)}>
            编辑
          </a>
        ),
      },
    ];

    const { currentPage, selectedRowKeys, batchSel } = this.state;
    const nuewCurrenPage = query?.page || 1;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.batchSelect,
      getCheckboxProps: (record) => ({
        disabled: record.post_status === 'wc-cancelled',
        // name: record.name,
      }),
    };

    return (
      // <PageContainer>
      <>
        <BasicHeader title="订单列表" />
        <Card className={style.cardbox}>
          <FilterOrder clearBatchSelect={this.clearBatchSelect} />
          <BatchSelect
            batchSel={batchSel}
            selectedRowKeys={selectedRowKeys}
            clearBatchSelect={this.clearBatchSelect}
            updateData={this.updateData}
            changeBetch={this.changeBetch}
          />
          <Table
            loading={loading}
            className={styles.tables}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={(r) => r.ID}
            columns={columns}
            dataSource={ordersList.data}
            onRow={(record) => {
              return {
                onClick: () => this.clickRow(record), // 点击行
              };
            }}
          />
          <TableFooter
            total={ordersList.meta && ordersList.meta.total}
            changePage={this.changePage}
            currentPage={nuewCurrenPage || currentPage}
            perPage={ordersList.meta && ordersList.meta.per_page}
            showSizeChanger
            showQuickJumper
          />
        </Card>
        {/* // </PageContainer> */}
      </>
    );
  }
}

export default Order;
