import React, { Component } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import BasicHeader from '@/components/BasicHeader';
import TableFooter from '@/components/TableFooter';
import FilterOrder from './FilterOrder';
import BatchSelect from './BatchSelect';
import style from './styles.less';

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
    const query = JSON.parse(sessionStorage.getItem('orderQuery')) || {};
    await dispatch({
      type: 'orders/fetch',
      payload: {
        page: 1,
        ...query,
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
    console.log(selectedRows);
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

    const { loading, ordersList, query } = this.props;
    const { currentPage, selectedRowKeys, batchSel } = this.state;
    const nuewCurrenPage = query.page;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.batchSelect,
    };

    return (
      // <PageContainer>
      <>
        <BasicHeader title="订单列表" />
        <Card className={style.cardbox}>
          <FilterOrder />
          <BatchSelect
            batchSel={batchSel}
            selectedRowKeys={selectedRowKeys}
            clearBatchSelect={this.clearBatchSelect}
            updateData={this.updateData}
          />
          <Table
            loading={loading}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={(r) => r.ID}
            columns={columns}
            dataSource={ordersList.data}
          />
          <TableFooter
            total={ordersList.meta && ordersList.meta.total}
            changePage={this.changePage}
            currentPage={nuewCurrenPage || currentPage}
            perPage={ordersList.meta && ordersList.meta.per_page}
            showSizeChanger
            showQuickJumper
            // changeShowSize={(page, prePage) => this.changePage(page, prePage, true)}
          />
        </Card>
        {/* // </PageContainer> */}
      </>
    );
  }
}

export default Order;
