import React, { Component } from 'react';
import { Modal, message, Empty } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/zh.json'));
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

@connect(({ loading }) => ({
  loading: loading.effects['customers/updateDefAddress'],
}))
class SelectAddress extends Component {
  state = {
    modalVisible: false,
    addressId: null,
    addressList: [],
  };

  // 初始化渲染的值和选中样式
  componentDidMount() {
    const { addressBook } = this.props;
    const list =
      addressBook &&
      addressBook.map((item) => {
        const child = item;
        if (item.default) {
          child.style = {
            borderColor: '#34395d',
          };
        } else {
          child.style = { borderColor: '#dcddeb' };
        }

        return child;
      });
    this.setState({
      addressList: list || [],
    });
  }

  // 选择地址改变样式以及传入id;
  select = (addressId, selIndex) => {
    const { addressList } = this.state;
    const list = addressList.map((item, index) => {
      const child = item;
      if (index === selIndex) {
        child.style = {
          borderColor: '#34395d',
        };
      } else {
        child.style = {
          borderColor: '#dcddeb',
        };
      }
      return child;
    });
    this.setState({
      addressId,
      addressList: list || [],
    });
  };

  // 更新默认地址并且重新取顾客数据
  update = async () => {
    const { dispatch, id, initData } = this.props;
    const { addressId } = this.state;
    if (addressId) {
      await dispatch({
        type: 'customers/updateDefAddress',
        payload: {
          addressId,
        },
        id,
      });
      message.success('更新成功');
      initData(id);
    }
    this.handleCancel();
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
    const { modalVisible, addressList } = this.state;
    const { loading } = this.props;
    return (
      <>
        <div onClick={this.showModal} className={styles.selectButton}>
          更多地址
        </div>
        <Modal
          title="更多地址"
          visible={modalVisible}
          onCancel={this.handleCancel}
          okButtonProps={{ loading, size: 'large', type: 'primary' }}
          onOk={this.update}
          cancelButtonProps={{ size: 'large' }}
          width={700}
          destroyOnClose
          centered
          maskClosable={false}
        >
          {addressList.length !== 0 ? (
            addressList.map((item, index) => (
              <div
                onClick={(e) => this.select(item.id, index, e)}
                key={item.id}
                className={styles.addressItem}
                style={item.style}
              >
                <p>
                  姓名：{item.first_name} {item.last_name}
                </p>
                <p>电话：{item.phone}</p>
                <p>
                  地址：{item.address_1 ? item.address_1 : '--'}
                  {item.address_2 && `，${item.address_2}`}
                  {item.city && `，${item.city}`}
                  {item.state_name && `，${item.state_name.split('/')[0]}`}
                  {item.country && `，${countries.getName(item.country, 'zh')}`}
                </p>
                <p>邮编：{item.postcode}</p>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </Modal>
      </>
    );
  }
}

export default SelectAddress;
