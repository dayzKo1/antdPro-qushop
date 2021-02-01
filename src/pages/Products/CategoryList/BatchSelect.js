import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Modal, message } from 'antd';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import styles from '../styles.less';

@connect(({ categories, loading }) => ({
  updateLoading: loading.effects['categories/batchDel'],
  query: categories.query,
}))
class BatchSelect extends Component {
  state = {
    modalVisible: false,
  };

  // 批量删除
  delBatch = async () => {
    const { selectedRowKeys, clearSelRowKeys, dispatch, query } = this.props;
    await dispatch({
      type: 'categories/batchDel',
      payload: selectedRowKeys,
      query,
    });
    message.success('删除成功');
    this.handleCancel();
    clearSelRowKeys();
  };

  // Modal事件
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { batchSel, selectedRowKeys, updateLoading } = this.props;
    const { modalVisible } = this.state;
    const isSelected = selectedRowKeys.length === 0;
    return (
      <div
        style={{
          padding: '0 94px 0 0',
          width: batchSel ? '100%' : '50px',
          position: 'absolute',
          zIndex: 2,
          left: 71,
          top: 95,
        }}
      >
        <div className={batchSel ? styles.batchSelect : styles.batchSelectDefault}>
          {batchSel ? (
            <>
              <CaretLeftOutlined style={{ marginLeft: '0px' }} />
              <span
                className={isSelected ? styles.disabled : ''}
                style={{ marginLeft: '25px' }}
                onClick={this.showModal}
              >
                删除
              </span>
              <Modal
                title="提示"
                visible={modalVisible}
                onCancel={this.handleCancel}
                onOk={this.delBatch}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ loading: updateLoading, size: 'large' }}
                cancelButtonProps={{ size: 'large' }}
                width={700}
                destroyOnClose
                maskClosable={false}
              >
                <div style={{ margin: '15px 0' }}>
                  <Icon
                    style={{
                      fontSize: 22,
                      color: '#1890ff',
                      marginRight: 10,
                      position: 'relative',
                      bottom: -2,
                    }}
                    type="exclamation-circle"
                    theme="filled"
                  />
                  <span> 此操作将永久删除{selectedRowKeys.length}个分类, 是否继续?</span>
                </div>
              </Modal>
            </>
          ) : (
            <CaretRightOutlined style={{ marginLeft: '0px' }} />
          )}
        </div>
      </div>
    );
  }
}

export default BatchSelect;
