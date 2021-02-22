/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

@connect()
class ImgUpload extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    beforeReturn: { showDownloadIcon: false },
  };

  componentDidMount() {
    const { initValue, isAdd, mediumUrl, type } = this.props;
    if (initValue && !isAdd) {
      this.setState({
        fileList: [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: initValue.medium,
          },
        ],
      });
    } else if (isAdd && mediumUrl !== null) {
      this.setState({ fileList: mediumUrl });
    }
    let list = [];
    if (type === 'product' && !isAdd && initValue && initValue.length > 0) {
      list = initValue.map((item, index) => ({
        ID: item.ID,
        uid: `-${index + 1}`,
        name: 'image.png',
        status: 'done',
        url: item.medium,
        // response: [item],
      }));
      this.setState({
        fileList: list,
      });
    } else {
      this.setState({
        fileList: [],
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    let { preview } = file;
    if (!file.url && !file.preview) {
      preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || preview,
      previewVisible: true,
    });
  };

  handleChange = (info) => {
    const { fileList } = info;
    const { onChange, changeMedium } = this.props;
    let filterError = fileList;
    if (info.file.status === 'error') {
      if (info.file.error.status === 500) {
        message.error(info.file.response?.message || '后端异常，请联系管理员');
      } else if (info.file.error.status === 422) {
        message.error('上传失败，请选择正确的文件类型，重新上传');
      }
      filterError = fileList.filter((item) => item.response && item.response[0]);
      this.setState({ fileList: filterError });
    } else {
      onChange(info.file.response && info.file.response[0]);
      this.setState({ fileList });
      changeMedium(fileList);
    }
  };

  beforeUpload = (file) => {
    const isLt8M = file.size / 1024 / 1024 < 8;
    if (!isLt8M) {
      this.setState({
        beforeReturn: false,
      });
      setTimeout(() => {
        this.setState({
          fileList: [],
        });
      }, 100);
      message.warning('您的图片尺寸过大，会影响买家的访问速度，请使用8M以下大小的图片');
    } else {
      this.setState({
        beforeReturn: { showDownloadIcon: false },
      });
    }

    return isLt8M;
  };

  render() {
    const { previewVisible, previewImage, fileList, beforeReturn } = this.state;
    const { type } = this.props;
    const headers = { Authorization: localStorage.getItem('token') };
    const uploadButton = (
      <div
        style={{
          color: '#0093fb',
          fontSize: '12px',
        }}
      >
        <PlusOutlined />
        添加图片
      </div>
    );
    return (
      <>
        <div className="clearfix" style={{ marginTop: 10 }}>
          <Upload
            action="/api/admin/attachments"
            name="files[]"
            listType="picture-card"
            fileList={fileList}
            headers={headers}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            className={styles.cateUpload}
            beforeUpload={this.beforeUpload}
            showUploadList={beforeReturn}
            accept=".jpeg,.jpg,.png,.gif"
          >
            {type === 'category' && fileList.length !== 0 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
            title="图片预览"
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </>
    );
  }
}

export default ImgUpload;
