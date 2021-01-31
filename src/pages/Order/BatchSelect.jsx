import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import style from './styles.less';

@connect(({ loading }) => ({
  loading: loading.effects['order/batchOrder'],
}))
class BatchSelect extends Component {
  state = {
    visible: false,
    type: null,
  };

  // 显示modal
  showModal = (type) => {
    this.setState({
      visible: true,
      type,
    });
  };

  handleOk = (type) => {
    if (type === 'fulfilled') {
      this.fulfilled();
    }
    if (type === 'complete' || type === 'ing') {
      this.complete(type);
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      type: null,
    });
  };

  //  发货
  fulfilled = async () => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    const selectedId = [];
    for (let i = 0; i < selectedRowKeys.length; i += 1) {
      selectedId.push({ id: selectedRowKeys[i], trackNo: '', sendEmail: true });
    }
    console.log(selectedId);
    await dispatch({
      type: 'order/batchOrder',
      payload: {
        order_shipping: selectedId,
      },
    });
    this.handleCancel();
    clearBatchSelect();
    updateData();
  };

  // 标记已完成 标记进行中
  complete = async (type) => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    const selectedId = [];
    for (let i = 0; i < selectedRowKeys.length; i += 1) {
      selectedId.push({
        id: selectedRowKeys[i],
        status: type === 'complete' ? 'wc-completed' : 'wc-processing',
      });
    }
    console.log('标记已完成', selectedId);
    try {
      await dispatch({
        type: 'order/batchOrder',
        payload: selectedId,
        // payload: {
        //   order_status: selectedId,
        // },
      });
    } catch (e) {
      console.log(e);
    }
    this.handleCancel();
    clearBatchSelect();
    updateData();
  };

  render() {
    const { batchSel, selectedRowKeys, loading } = this.props;
    const { visible, type } = this.state;
    return (
      <div
        style={{
          padding: '0 50px 0 0',
          width: batchSel ? '98.5%' : '50px',
          position: 'absolute',
          zIndex: 2,
          left: 40,
          top: 70,
        }}
      >
        <div>
          {batchSel ? (
            <div style={{ backgroundColor: '#fafafa' }}>
              <CaretLeftOutlined style={{ marginRight: '10px' }} />
              <a onClick={() => this.showModal('fulfilled')} className={style.link}>
                发货
              </a>
              <a onClick={() => this.showModal('complete')} className={style.link}>
                标记已完成
              </a>
              <a onClick={() => this.showModal('ing')} className={style.link}>
                标记进行中
              </a>
            </div>
          ) : (
            <CaretRightOutlined />
          )}
        </div>
        <Modal
          title={[
            type === 'fulfilled' && `发货${selectedRowKeys.length}个订单`,
            type === 'complete' && `标记已完成${selectedRowKeys.length}个订单`,
            type === 'ing' && `标记进行中${selectedRowKeys.length}个订单`,
          ]}
          visible={visible}
          cancelText="取消"
          okText="确定"
          onOk={() => this.handleOk(type)}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          {type === 'fulfilled' && <p>确定发货吗？</p>}
          {type === 'complete' && <p>确定标记已完成吗？</p>}
          {type === 'ing' && <p>确定标记进行中吗？</p>}
        </Modal>
      </div>
    );
  }
}

export default BatchSelect;
