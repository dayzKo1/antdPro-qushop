import React, { Component } from 'react';
import { Modal } from 'antd';
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
      this.putShelf();
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

  putShelf = async (type) => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    const selectedPro = [];
    for (let i = 0; i < selectedRowKeys.length; i += 1) {
      selectedPro.push({
        id: selectedRowKeys[i],
        status: type === 'put' ? 'publish' : 'private',
      });
    }
    console.log(selectedPro);
    await dispatch({
      type: 'product/batchProduct',
      payload: {
        product_status: selectedPro,
      },
    });
    this.handleCancel();
    clearBatchSelect();
    updateData();
  };

  // 批量删除
  delProducts = async () => {
    const { dispatch, selectedRowKeys, clearBatchSelect, updateData } = this.props;
    const selectedPro = [];
    for (let i = 0; i < selectedRowKeys.length; i += 1) {
      selectedPro.push({ id: selectedRowKeys[i] });
    }
    console.log('delProducts', selectedPro);
    try {
      await dispatch({
        type: 'product/batchProduct',
        payload: {
          delete_product: selectedPro,
        },
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
              <a onClick={() => this.showModal('put')} className={style.link}>
                上架
              </a>
              <a onClick={() => this.showModal('off')} className={style.link}>
                下架
              </a>
              <a onClick={() => this.showModal('del')} className={style.link}>
                删除
              </a>
            </div>
          ) : (
            <CaretRightOutlined />
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
