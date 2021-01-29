import React, { Component } from 'react';
// import { Icon} from 'antd';
import { connect } from 'dva';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import style from './style.less';

@connect(() => ({}))
class BatchSelect extends Component {
  putShelf = async () => {
    const { dispatch, selectedRowKeys, clearBatchSelect } = this.props;
    const selectedPro = [];
    for (let i = 0; i < selectedRowKeys.length; i += 1) {
      selectedPro.push({ id: selectedRowKeys[i], status: 'private' });
    }
    console.log(selectedPro);
    await dispatch({
      type: 'product/putProduct',
      payload: {
        product_status: selectedPro,
      },
    });
    clearBatchSelect();
  };

  render() {
    const { batchSel } = this.props;
    return (
      <div
        style={{
          padding: '0 50px 0 0',
          width: batchSel ? '99%' : '50px',
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
              <a onClick={this.putShelf} className={style.link} style={{ marginRight: '10px' }}>
                上架
              </a>
              <a onClick={this.offShelf} className={style.link} style={{ marginRight: '10px' }}>
                下架
              </a>
              <a onClick={this.batchDel} className={style.link}>
                删除
              </a>
            </div>
          ) : (
            <CaretRightOutlined />
          )}
        </div>
      </div>
    );
  }
}

export default BatchSelect;
