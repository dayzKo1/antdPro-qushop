import React, { useState } from 'react';
import { connect } from 'dva';
import { Icon, Modal, message } from 'antd';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import styles from '../styles.less';

const BatchSelect = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { batchSel, selectedRowKeys, updateLoading, showBatchSel } = props;
  const isSelected = selectedRowKeys.length === 0;

  // Modal事件
  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // 批量删除
  const delBatch = async () => {
    const { clearSelRowKeys, dispatch, query } = props;
    await dispatch({
      type: 'categories/batchDel',
      payload: selectedRowKeys,
      query,
    });
    message.success('删除成功');
    handleCancel();
    clearSelRowKeys();
  };

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
            <CaretLeftOutlined style={{ marginLeft: '0px' }} onClick={showBatchSel} />
            <span
              className={isSelected ? styles.disabled : ''}
              style={{ marginLeft: '25px' }}
              onClick={showModal}
            >
              删除
            </span>
            <Modal
              title="提示"
              visible={modalVisible}
              onCancel={handleCancel}
              onOk={delBatch}
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
          <CaretRightOutlined style={{ marginLeft: '0px' }} onClick={showBatchSel} />
        )}
      </div>
    </div>
  );
};

export default connect(({ categories, loading }) => ({
  updateLoading: loading.effects['categories/batchDel'],
  query: categories.query,
}))(BatchSelect);
