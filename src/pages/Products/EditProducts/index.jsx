import React, { Component } from 'react';
import { Form, InputNumber, Alert, Select, Input, Radio, message, Button, Card, Modal } from 'antd';
import { connect } from 'dva';
import { Prompt } from 'react-router';
import { InfoCircleOutlined } from '@ant-design/icons';
import BasicHeader from '@/components/BasicHeader';
import { history } from 'umi';
// import AddTag from './addTag';
// import AddPicture from './addPicture';
import ImgUpload from '@/components/ImgUpload';
import TinyMce from '@/components/TinyMce';
import styles from '@/global.less';
// import { render } from 'react-dom';
// import style from '../style.less';
const { Option } = Select;

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postStatus: 'publish',
      mediumUrl: [],
      noSaveTip: false,
      alertMsg: [],
    };
  }

  formRef = React.createRef();

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'categories/fetchList' });
    dispatch({ type: 'tag/fetchProTags', payload: null });
    this.initProDetail();
  }

  componentWillUnmount() {
    // 销毁拦截判断是否离开当前页面
    this.props.dispatch({
      type: 'products/clearDetail',
    });
    window.removeEventListener('beforeunload', this.beforeunload);
  }

  onChangeShelf = (e) => {
    this.setState({
      postStatus: e.target.value,
    });
  };

  // 初始化商品数据
  initProDetail = async () => {
    const { dispatch } = this.props;
    // const isAdd = this.props.location.pathname.includes('add');
    const { id } = this.props.match.params;
    const isAdd = this.props.location.pathname.includes('add');
    const { setFieldsValue, getFieldsValue } = this.formRef.current;
    if (!isAdd) {
      try {
        const res = await dispatch({
          type: 'product/fetchProductDetail',
          payload: {
            id,
          },
        });
        const cateInit = res && res.categories && res.categories.map((item) => item.name);
        const tagInit = res && res.tags && res.tags.map((item) => item.name);
        const img = res && res.gallery ? res.gallery.map((item) => item.ID) : [];
        setFieldsValue({
          title: res && res?.post_title,
          price: res && res?.price,
          regular_price: res && res?.regular_price,
          sku: res && res?.sku,
          categories: res && cateInit,
          tags: res && tagInit,
          post_status: res && res?.post_status,
          gallery: res && img,
          post_content: res && res?.post_content,
        });
        this.setState({
          mediumUrl: res.gallery ? res.gallery : [],
        });
      } catch (e) {
        if (e.response && e.response.status === 404) {
          message.warning('商品不存在');
        } else if (e.response && e.response.status === 500) {
          message.error('商品数据出错');
        }
        history.push(`/products/ProductsList/add`);
      }
    }
    window.addEventListener('beforeunload', this.beforeunload);
    sessionStorage.setItem('formData', JSON.stringify(getFieldsValue(true)));
  };

  handleChange = (tags) => {
    const { dispatch } = this.props;
    if (!tags.length || tags[tags.length - 1].replace(/(^\s*)|(\s*$)/g, '') !== '') {
      dispatch({
        type: 'tag/add',
        payload: tags,
      });
    } else {
      tags.pop();
      this.formRef.current.setFieldsValue({ tags });
    }
  };

  stopDefault = (e) => {
    e.stopPropagation();
  };

  // 保存
  handleSubmit = async (values) => {
    // e.preventDefault();
    const { dispatch, addTags, productDetail, categoryList } = this.props;
    const { mediumUrl } = this.state;
    const { id } = this.props.match.params;
    const isAdd = this.props.location.pathname.includes('add');
    const { isFieldTouched } = this.formRef.current;
    // tupian id
    // const imgId=[]
    const gallery = mediumUrl.filter((item) => item.ID);
    const filterID = gallery && gallery.map((item) => item?.ID);
    const gallery2 = mediumUrl.filter((item) => item.response && item.response[0]);

    const filterID2 = gallery2 && gallery2.map((item) => item.response && item.response[0]);

    const imgId = [...filterID, ...filterID2];

    console.log('====1', imgId);
    // 处理标签
    let tags = [];
    if (isFieldTouched('tags')) {
      tags = addTags;
    } else if (!isAdd) {
      tags = productDetail.tags.map((item) => item.term_taxonomy_id);
    }
    // 处理分类
    const categories = [];
    categoryList.forEach((item) => {
      // console.log('.....',values.categories)
      values.categories.forEach((item2) => {
        if (item.name === item2) {
          categories.push(item.id);
        }
      });
    });

    try {
      if (isAdd) {
        const res = await dispatch({
          type: 'product/add',
          payload: {
            ...values,
            tags,
            categories,
            manage_stock: 'yes',
            gallery: imgId,
          },
        });
        // this.setState({ productIndex: 0 });
        // await dispatch({
        //   type: 'product/fetch',
        //   payload: {
        //     page: 1,
        //   },
        //   save: true,
        // });
        await this.setSaveTrue();
        message.success('保存成功');
        history.push(`/products/productsList/${res.ID}/edit`);
        this.initProDetail();
      } else {
        await dispatch({
          type: 'product/update',
          payload: {
            ...values,
            tags,
            categories,
            manage_stock: 'yes',
            gallery: imgId,
          },
          id,
        });
        await this.setSaveTrue();
        message.success('保存成功');
        this.initProDetail();
      }
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
  };

  changeMedium = (mediumUrl) => {
    this.setState({ mediumUrl });
  };

  // 判断是否为点击保存产生的页面跳转
  setSaveTrue = () => {
    this.setState({
      isSave: true,
    });
  };

  // react-router切换路由前的提示函数
  handlePrompt = (location) => {
    const { isSave } = this.state;
    const { getFieldsValue } = this.formRef.current;
    const isDiff = JSON.stringify(getFieldsValue(true)) !== sessionStorage.getItem('formData');
    // 如果是保存按钮不中断
    if (isSave || location?.pathname === '/user/login') {
      return true;
    }
    // 如果表单修改过中断跳转，弹出modal
    if (isDiff) {
      console.log(isDiff);
      this.setState({
        noSaveTip: true,
        location,
      });
      return false;
    }
    return true;
  };

  // 未保存的modal事件
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
    dispatch(history.push({ pathname: location.pathname }));
  };

  back = () => {
    const { dispatch } = this.props;
    dispatch(history.push({ pathname: '/products/categoryList' }));
  };

  render() {
    const { productDetail, loading, updateLoading, addLoading, categoryList, proTags } = this.props;
    const { postStatus, mediumUrl, alertMsg, noSaveTip } = this.state;
    const { id } = this.props.match.params;
    const { getFieldsValue, isFieldsTouched } = this.formRef.current || {};
    const isAdd = this.props.location.pathname.includes('add');
    const isDiff =
      getFieldsValue && JSON.stringify(getFieldsValue(true)) !== sessionStorage.getItem('formData');

    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 12,
      },
    };

    const cateOptions = categoryList.map((o) => (
      <Option key={o.term_taxonomy_id} value={o.name}>
        {o.name}
      </Option>
    ));
    const tagOptions = proTags.map((o) => (
      <Option key={o.term_taxonomy_id} value={o.name}>
        {o.name}
      </Option>
    ));
    const cateInit = productDetail.categories && productDetail.categories.map((item) => item.name);
    const tagInit = productDetail.tags && productDetail.tags.map((item) => item.name);
    return (
      <>
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
        <BasicHeader
          parent="商品列表"
          title={isAdd ? '/添加商品' : '/商品详情'}
          parentUrl="/products/productsList"
        ></BasicHeader>

        <Form
          //  form={form}
          ref={this.formRef}
          onFinish={this.handleSubmit}
          name="validate_other"
          {...formItemLayout}
          onFieldsChange={() => {
            const { status } = this.state;
            this.setState({
              status: !status,
            });
          }}
        >
          <Card className={styles.cardBox} loading={loading}>
            <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
              {' '}
              基础信息
            </div>

            <Form.Item
              name="title"
              label="商品名称"
              initialValue={id && productDetail?.post_title}
              rules={[
                {
                  required: true,
                  message: '请输入商品名称',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="价格"
              initialValue={id && productDetail?.price}
              rules={[
                {
                  required: true,
                  message: '商品价格不可为空!',
                },
              ]}
            >
              <InputNumber
                style={{ width: '30%' }}
                min={0}
                precision={2}
                // step={0.1}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                allowClear
                max={99999999}
                maxLength={11}
              />
            </Form.Item>
            <Form.Item
              name="regular_price"
              label="原价"
              initialValue={id && productDetail && productDetail?.regular_price}
            >
              <InputNumber
                min={0}
                style={{ width: '30%' }}
                precision={2}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                allowClear
                addonAfter="USD"
                max={99999999}
                maxLength={11}
              />
            </Form.Item>

            <Form.Item
              name="sku"
              label="SKU"
              initialValue={id && productDetail?.sku}
              rules={[
                {
                  required: true,
                  message: '请输入SKU',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="商品分类">
              <Form.Item name="categories" initialValue={id && cateInit ? cateInit : []}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  allowClear
                  // placeholder={tr('products.category1.placeholder', '请选择商品分类')}
                >
                  {cateOptions}
                </Select>
              </Form.Item>
            </Form.Item>

            <Form.Item label="商品标签">
              <Form.Item name="tags" initialValue={id && tagInit ? tagInit : []}>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  allowClear
                  tokenSeparators={[',']}
                  onChange={this.handleChange}
                >
                  {tagOptions}
                </Select>
              </Form.Item>
            </Form.Item>

            <Form.Item
              name="post_status"
              label="是否上下架"
              initialValue={productDetail.post_status || postStatus}
            >
              <Radio.Group onChange={this.onChangeShelf}>
                <Radio value={'publish'}>上架</Radio>
                <Radio value={'private'}>下架</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="gallery"
              label="商品图片"
              initialValue={
                productDetail.gallery ? productDetail.gallery.map((item) => item.ID) : []
              }
            >
              {/* <AddPicture  isAdd={isAdd} gallery={id ? productDetail.gallery : ''} /> */}
              <ImgUpload
                initValue={productDetail?.gallery}
                isAdd={isAdd}
                changeMedium={this.changeMedium}
                mediumUrl={mediumUrl}
                type="product"
              />
            </Form.Item>
          </Card>
          <Card className={styles.cardBox} loading={loading}>
            <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
              {' '}
              商品详情
            </div>

            {(productDetail.ID || isAdd) && (
              <Form.Item
                wrapperCol={{
                  span: 24,
                  // offset: 6,
                }}
                name="content"
                initialValue={id && productDetail?.post_content}
              >
                <TinyMce />
              </Form.Item>
            )}
          </Card>
          <div style={{ paddingTop: 20, borderTop: '1px solid #dcdfe6' }}>
            <Form.Item
              wrapperCol={{
                span: 24,
                // offset: 6,
              }}
              style={{ float: 'right' }}
            >
              <Button
                loading={loading || updateLoading || addLoading}
                style={{ marginRight: '15px' }}
                type="primary"
                htmlType="submit"
                disabled={!(isFieldsTouched && isFieldsTouched() && isDiff)}
                // onClick={this.handleSubmit}
              >
                保存
              </Button>
              <Button loading={loading || updateLoading || addLoading}>取消</Button>
            </Form.Item>
          </div>
        </Form>
      </>
    );
  }
}

export default connect((state) => ({
  productDetail: state.product.productDetail,
  loading: state.loading.effects['product/fetchProductDetail'],
  updateLoading: state.loading.effects['product/update'],
  addLoading: state.loading.effects['product/add'],
  categoryList: state.categories.categoryList,
  proTags: state.tag.proTags,
  addTags: state.tag.addTags,
  // updateLoading: state.loading.effects['categories/batchDel'],
}))(ProductDetail);
