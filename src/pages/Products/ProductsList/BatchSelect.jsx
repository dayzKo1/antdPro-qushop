import React, { Component } from 'react';
import { Modal, message } from 'antd';
import { connect } from 'dva';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import style from './style.less';

@connect(({ loading }) => ({
  loading: loading.effects['product/batchProduct'],
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
    if (type === 'put' || type === 'off') {
      this.putOffShelf(type);
    }
    if (type === 'del') {
      this.delProducts();
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      type: null,
    });
  };

  // 上下架
  putOffShelf = async (type) => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    try {
      await dispatch({
        type: 'product/batchProduct',
        operating: 'putOffShelf',
        ids: selectedRowKeys,
        status: type,
      });
      message.success(type === 'put' ? '上架成功！' : '下架成功！');
    } catch (e) {
      message.error(type === 'put' ? '上架失败！' : '下架失败！');
    }
    this.handleCancel();
    clearBatchSelect();
    updateData();
  };

  // 批量删除
  delProducts = async () => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    try {
      await dispatch({
        type: 'product/batchProduct',
        operating: 'delProducts',
        ids: selectedRowKeys,
      });
      message.success('删除成功！');
    } catch (e) {
      message.error('删除失败！');
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
        {/*  */}
        <div className={batchSel ? style.batchSelect : style.batchSelectDefault}>
          {batchSel ? (
            <div style={{ backgroundColor: '#fafafa' }}>
              <CaretLeftOutlined onClick={changeBetch} style={{ marginLeft: '0px' }} />
              <span
                onClick={() => this.showModal('put')}
                className={disabled ? style.disabled : ''}
              >
                上架
              </span>
              <span
                onClick={() => this.showModal('off')}
                className={disabled ? style.disabled : ''}
              >
                下架
              </span>
              <span
                onClick={() => this.showModal('del')}
                className={disabled ? style.disabled : ''}
              >
                删除
              </span>
            </div>
          ) : (
            <CaretRightOutlined onClick={changeBetch} style={{ marginLeft: '0px' }} />
          )}
        </div>
        <Modal
          title={[
            type === 'put' && `上架${selectedRowKeys.length}个商品`,
            type === 'off' && `下架${selectedRowKeys.length}个商品`,
            type === 'del' && `删除${selectedRowKeys.length}个商品`,
          ]}
          visible={visible}
          cancelText="取消"
          okText="确定"
          onOk={() => this.handleOk(type)}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          {type === 'put' && <p>确定上架吗？</p>}
          {type === 'off' && <p>确定下架吗？</p>}
          {type === 'del' && <p>确定删除吗？</p>}
        </Modal>
      </div>
    );
  }
}

export default BatchSelect;
