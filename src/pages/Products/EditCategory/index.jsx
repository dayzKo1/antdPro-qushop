import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Button, message, Form, Modal, Row, Col, Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Prompt } from 'react-router';
import { routerRedux } from 'dva/router';
import Grid from '@/components/Grid';
import BasicHeader from '@/components/BasicHeader';
import TinyMce from '@/components/TinyMce';
import ImgUpload from '@/components/ImgUpload';
import LinkList from './LinkList';
import styles from './styles.less';

class EditCategory extends Component {
  state = {
    noSaveTip: false,
    alertMsg: [],
    isSave: false,
    linkList: [],
    location: '',
    mediumUrl: [],
    sortType: 'manual',
    status: false,
  };

  formRef = React.createRef();

  async componentDidMount() {
    const { dispatch } = this.props;
    const isAdd = this.props.location.pathname.includes('add');
    const { id } = this.props.match.params;
    const { setFieldsValue, getFieldsValue } = this.formRef.current;
    if (!isAdd) {
      const res = await dispatch({
        type: 'categories/fetchDetail',
        payload: {
          id,
        },
      });
      this.setState({
        linkList: res.posts,
        sortType: res.sort_type || 'manual',
        mediumUrl: res.thumbnail ? [res.thumbnail] : [],
      });
      setFieldsValue({
        name: res?.name,
        description: res?.description,
        thumbnail: res?.thumbnail?.ID,
      });
    } else {
      await dispatch({ type: 'categories/clearDetail' });
      setFieldsValue({ name: undefined, description: undefined, thumbnail: undefined });
    }
    window.addEventListener('beforeunload', this.beforeunload);
    sessionStorage.setItem('formData', JSON.stringify(getFieldsValue()));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload);
  }

  beforeunload = (e) => {
    const { getFieldsValue } = this.formRef.current;
    const isDiff = JSON.stringify(getFieldsValue()) !== sessionStorage.getItem('formData');
    if (isDiff) {
      (e || window.event).returnValue = '你确定离开此页面吗?';
    }
  };

  getLinkData = async (ids, onChange) => {
    const { dispatch } = this.props;
    const { linkList = [] } = this.state;

    const res = await dispatch({
      type: 'product/fetch',
      payload: {
        'filter[id]': ids.join(','),
        page_size: ids.length,
      },
    });

    const list = linkList.concat(res.data);
    const linkIds = list.map((item) => item?.ID);
    onChange(linkIds);
    this.setState({
      linkList: list,
    });
  };

  delLink = (index, onChange) => {
    const { linkList } = this.state;
    const list = linkList;
    list.splice(index, 1);
    const ids = list.map((item) => item.ID);
    onChange(ids);
    this.setState({
      linkList: list,
    });
  };

  batchDelLink = (indexs, onChange) => {
    const { linkList } = this.state;
    const list = linkList;
    indexs.sort((a, b) => (a < b ? 1 : -1));
    indexs.forEach((item) => {
      list.splice(item, 1);
    });
    const ids = list.map((item) => item.ID);
    onChange(ids);
    this.setState({
      linkList: list,
    });
  };

  setTopLink = (indexs, onChange) => {
    const { linkList } = this.state;
    const list = linkList;
    const setList = [];
    indexs.sort((a, b) => (a > b ? 1 : -1));
    for (let i = 0; i < indexs.length; i += 1) {
      const data = list[indexs[i] - i];
      setList.push(data);
      list.splice(indexs[i] - i, 1);
    }
    Array.prototype.push.apply(setList, list);
    const ids = setList.map((item) => item.ID);
    onChange(ids);
    this.setState({
      linkList: setList,
    });
  };

  sortLink = (linkList, onChange) => {
    const linkIds = linkList.map((item) => item.ID);
    onChange(linkIds);
    this.setState({
      linkList,
    });
  };

  handleSubmit = async (values) => {
    const { dispatch, cateDetail } = this.props;
    const { linkList, sortType, mediumUrl } = this.state;
    const { id } = this.props.match.params;
    const isAdd = this.props.location.pathname.includes('add');
    const { name, slug, description } = values;
    const productIds = values.product_ids;
    const thumbnail =
      mediumUrl &&
      mediumUrl[0] &&
      ((mediumUrl[0].response && mediumUrl[0].response[0]) || mediumUrl[0].ID);
    // if (err) {
    //   const field = Object.values(err)[0].errors && Object.values(err)[0].errors[0].field;
    //   const errHeight =
    //     document.getElementById(field).getBoundingClientRect().top + window.scrollY - 110;
    //   return window.scrollTo(0, errHeight);
    // }
    try {
      if (isAdd) {
        await dispatch({
          type: 'categories/saveDetail',
          payload: {
            term: { name, description, productIds, thumbnail },
            description,
            thumbnail: { ID: thumbnail },
            posts: linkList,
            seo_title: name,
            seo_description: description,
            slug,
          },
        });
        await dispatch({
          type: 'categories/add',
          payload: {
            name,
            description,
            product_ids: productIds,
            thumbnail,
            sort_type: sortType,
            seo_title: name,
            seo_description: description,
          },
        });
      } else {
        await dispatch({
          type: 'categories/update',
          payload: {
            name,
            description,
            product_ids: productIds,
            seo_title: values.seo_title || cateDetail.seo_title,
            seo_description: values.seo_description || cateDetail.seo_description,
            slug: slug || cateDetail.slug,
            thumbnail,
            sort_type: sortType,
          },
          id,
        });
      }
      await this.setSaveTrue();
      message.success('保存成功');
      dispatch(routerRedux.push({ pathname: '/products/categoryList' }));
    } catch (error) {
      const { errors } = error;
      let msg = [];
      if (this.state.alertMsg !== []) {
        this.setState({
          alertMsg: [],
        });
      }
      if (error?.status_code === 422) {
        Object.keys(errors).forEach((item, index) => {
          msg.push({ value: errors[item], id: index });
        });
      } else if (error?.status_code === 500) {
        msg = [{ value: error.message, id: 0 }];
      }
      this.setState({
        alertMsg: msg,
      });
    }
    return 0;
  };

  setSaveTrue = () => {
    this.setState({
      isSave: true,
    });
  };

  handlePrompt = (location) => {
    const { isSave } = this.state;
    const { getFieldsValue } = this.formRef.current;
    const isDiff = JSON.stringify(getFieldsValue()) !== sessionStorage.getItem('formData');
    if (isSave || location?.pathname === '/user/login') {
      return true;
    }
    if (isDiff) {
      this.setState({
        noSaveTip: true,
        location,
      });
      return false;
    }
    return true;
  };

  noSaveModalCancel = () => {
    this.setState({
      noSaveTip: false,
    });
  };

  noSaveModalOk = () => {
    const { location } = this.state;
    const { dispatch } = this.props;
    this.setState({
      noSaveTip: false,
    });
    dispatch(routerRedux.push({ pathname: location.pathname }));
  };

  back = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/products/categoryList' }));
  };

  changeMedium = (mediumUrl) => {
    this.setState({ mediumUrl });
  };

  changeSortType = (sortType) => {
    this.setState({ sortType });
  };

  render() {
    const isAdd = this.props.location.pathname.includes('add');
    const { linkList, noSaveTip, alertMsg, mediumUrl, sortType } = this.state;
    const { saveLoading, updateLoading, loading, cateDetail } = this.props;
    const totalLoading = loading || saveLoading || updateLoading;
    const { getFieldError, getFieldsValue } = this.formRef.current || {};
    const isDiff =
      getFieldsValue && JSON.stringify(getFieldsValue()) !== sessionStorage.getItem('formData');
    return (
      <div className={styles.editCategory}>
        <Grid>
          <Prompt when={!noSaveTip} message={this.handlePrompt} />
          <Modal
            title="提示"
            visible={noSaveTip}
            onCancel={this.noSaveModalCancel}
            onOk={this.noSaveModalOk}
            okButtonProps={{ size: 'large' }}
            cancelButtonProps={{ size: 'large' }}
            width={700}
            destroyOnClose
            centered
          >
            <div style={{ margin: '15px 0' }}>
              <InfoCircleOutlined
                style={{
                  fontSize: 22,
                  color: '#606266',
                  marginRight: 10,
                  position: 'relative',
                  bottom: -2,
                }}
              />
              <span>您的操作将不会被保存, 是否继续?</span>
            </div>
          </Modal>
          {alertMsg.map((item) => (
            <Alert
              key={item.id}
              message={item.value}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 10 }}
            />
          ))}
          <Form
            ref={this.formRef}
            onFinish={this.handleSubmit}
            onFieldsChange={() => {
              const { status } = this.state;
              this.setState({
                status: !status,
              });
            }}
          >
            <BasicHeader
              parent="商品分类"
              title={isAdd ? '/添加分类' : '/编辑分类'}
              parentUrl="/products/categoryList"
            />
            <Row gutter={20}>
              <Col span={24}>
                <Card loading={totalLoading} className={styles.cardbox}>
                  <div className={styles.title}>分类名称</div>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: '请输入分类标题，且不多于128个字符' },
                      { max: 128, message: '请输入分类标题，且不多于128个字符' },
                    ]}
                    initialValue={cateDetail?.term && cateDetail?.term?.name}
                  >
                    <Input placeholder="请输入分类名" allowClear />
                  </Form.Item>
                  <div className={styles.title} style={{ marginTop: '25px' }}>
                    <span>分类图片</span>
                  </div>
                  <Form.Item
                    name="thumbnail"
                    initialValue={(cateDetail?.thumbnail && cateDetail?.thumbnail.ID) || undefined}
                  >
                    <ImgUpload
                      initValue={cateDetail?.thumbnail}
                      isAdd={isAdd}
                      changeMedium={this.changeMedium}
                      mediumUrl={mediumUrl}
                      type="category"
                    />
                  </Form.Item>
                  <div className={styles.title} style={{ marginTop: 20 }}>
                    <span>分类描述</span>
                  </div>
                  {(cateDetail?.id || isAdd) && (
                    <Form.Item name="description" initialValue={cateDetail?.description}>
                      <TinyMce />
                    </Form.Item>
                  )}
                </Card>
                <Card loading={totalLoading} className={styles.cardbox}>
                  <Form.Item
                    name="product_ids"
                    initialValue={(cateDetail?.term && cateDetail?.term.product_ids) || undefined}
                  >
                    <LinkList
                      linkList={linkList}
                      getLinkData={this.getLinkData}
                      delLink={this.delLink}
                      sortLink={this.sortLink}
                      batchDelLink={this.batchDelLink}
                      setTopLink={this.setTopLink}
                      sortType={sortType}
                      changeSortType={this.changeSortType}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            <div
              style={{
                paddingTop: 20,
                marginBottom: 20,
                overflow: 'hidden',
                borderTop: '1px solid #dcdfe6',
              }}
            >
              <Form.Item style={{ float: 'right' }}>
                <Button
                  loading={totalLoading}
                  style={{ float: 'right' }}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={(getFieldsValue && getFieldError('name')[0]) || !isDiff}
                >
                  保存
                </Button>
              </Form.Item>
              <Button
                loading={totalLoading}
                onClick={this.back}
                style={{ float: 'right', marginRight: 10 }}
                size="large"
              >
                取消
              </Button>
            </div>
          </Form>
        </Grid>
      </div>
    );
  }
}

export default connect(({ categories, product, loading }) => ({
  cateDetail: categories.cateDetail,
  loading: loading.effects['categories/fetchDetail'],
  saveLoading: loading.effects['categories/add'],
  updateLoading: loading.effects['categories/update'],
  productsList: product.productsList,
}))(EditCategory);
