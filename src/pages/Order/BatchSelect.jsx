import React, { Component } from 'react';
import { Modal, message } from 'antd';
import { connect } from 'dva';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import style from './styles.less';

@connect(({ loading }) => ({
  loading: loading.effects['orders/batchOrder'],
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
      this.mark(type);
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

    try {
      await dispatch({
        type: 'orders/batchOrder',
        operating: 'fulfilled',
        ids: selectedRowKeys,
      });
      message.success('发货成功！');
    } catch (e) {
      message.error('发货失败！');
    }
    this.handleCancel();
    clearBatchSelect();
    updateData();
  };

  // 标记已完成 标记进行中
  mark = async (type) => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    try {
      await dispatch({
        type: 'orders/batchOrder',
        operating: 'mark',
        ids: selectedRowKeys,
        status: type,
      });
      message.success(type === 'complete' ? '标记已完成成功！' : '标记进行中成功！');
    } catch (e) {
      message.error(type === 'complete' ? '标记已完成失败！' : '标记进行中失败！');
    }
    this.handleCancel();
    clearBatchSelect();
    updateData();
  };

  render() {
    const { batchSel, selectedRowKeys, loading, changeBetch } = this.props;
    const { visible, type } = this.state;
    const disabled = selectedRowKeys.length === 0;
    return (
      <div
        style={{
          padding: '0 50px 0 0',
          width: batchSel ? '99.2%' : '50px',
          position: 'absolute',
          zIndex: 2,
          left: 36,
          top: 53,
        }}
      >
        <div className={batchSel ? style.batchSelect : style.batchSelectDefault}>
          {batchSel ? (
            <div style={{ backgroundColor: '#fafafa' }}>
              <CaretLeftOutlined onClick={changeBetch} style={{ marginLeft: '0px' }} />
              <a
                onClick={() => this.showModal('fulfilled')}
                className={disabled ? style.disabled : ''}
              >
                发货
              </a>
              <a
                onClick={() => this.showModal('complete')}
                className={disabled ? style.disabled : ''}
              >
                标记已完成
              </a>
              <a onClick={() => this.showModal('ing')} className={disabled ? style.disabled : ''}>
                标记进行中
              </a>
            </div>
          ) : (
            <CaretRightOutlined onClick={changeBetch} style={{ marginLeft: '0px' }} />
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
