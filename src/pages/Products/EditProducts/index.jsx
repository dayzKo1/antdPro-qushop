import React, { useEffect, useState } from 'react';
import {
  Form,
  InputNumber,
  // Switch,
  Input,
  Radio,
  // Slider,
  Button,
  Card,
} from 'antd';
import { connect } from 'dva';
import BasicHeader from '@/components/BasicHeader';
import AddCate from './addCate';
import AddTag from './addTag';
import AddPicture from './addPicture';
import TinyMce from '@/components/TinyMce';
import styles from '@/global.less';
// import style from '../style.less';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
};
// const formRef = React.createRef();
const ProductDetail = (props) => {
  // const [formRef] = React.createRef();
  const [form] = Form.useForm();
  const [postStatus, setPostStatus] = useState('publish');
  const { dispatch, productDetail, loading } = props;
  const { id } = props.match.params;
  
  const { getFieldError,getFieldsValue } = form;
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'product/fetchProductDetail',
        payload: {
          id,
        },
      });
     
    }
  }, []);
  // sessionStorage.setItem('formData', JSON.stringify(getFieldsValue(true)));
  console.log(form.getFieldsValue())
  // console.log(';;;;', id);

  const onChangeShelf = (e) => {
    // console.log('radio checked', e.target.value);
    setPostStatus(e.target.value);
  };
  const isAdd = props.location.pathname.includes('add');
  const isDiff =
  getFieldsValue && JSON.stringify(getFieldsValue()) !== sessionStorage.getItem('formData');
  return (
    <>
      <BasicHeader
        parent="商品列表"
        title={isAdd?"/添加商品": "/商品详情"}
        parentUrl="/products/productsList"
      ></BasicHeader>

      <Form
        name="validate_other"
        {...formItemLayout}
        // initialValues={{
        //   post_title: id && productDetail && productDetail.post_title,
        //   price: id && productDetail.price,
        //   regular_price: id && productDetail.regular_price,
        //   sku: id && productDetail.sku,
        //   categories: id && productDetail.categories,
        //   tags: id && productDetail.tags,
        //   post_status: (id && productDetail.post_status) || postStatus,
        // }}
      >
        <Card className={styles.cardBox} loading={loading}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}> 基础信息</div>

          <Form.Item
            name="post_title"
            label="商品名称"
            initialValue={id &&productDetail?.post_title}
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
            initialValue={id &&productDetail?.price}
            rules={[
              {
                required: true,
                message: '商品价格不可为空!',
              },
            ]}
          >
            <InputNumber min={0} precision={2} allowClear max={99999999} maxLength={11} />
          </Form.Item>
          <Form.Item name="regular_price" label="原价"  initialValue={id && productDetail && productDetail?.regular_price}>
            <InputNumber
              min={0}
              precision={2}
              allowClear
              addonAfter="USD"
              max={99999999}
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
            initialValue={id &&productDetail?.sku}
            rules={[
              {
                required: true,
                message: '请输入SKU',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="categories" label="商品分类" initialValue={id && productDetail?.categories}>
            <AddCate detail={id ? productDetail : ''} />
          </Form.Item>

          <Form.Item name="tags" label="商品标签">
            <AddTag detail={id ? productDetail : ''} />
          </Form.Item>

          <Form.Item name="post_status" label="是否上下架"
           initialValue={ productDetail.post_status || postStatus}
           >
            <Radio.Group onChange={onChangeShelf}>
              <Radio value={'publish'}>上架</Radio>
              <Radio value={'private'}>下架</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="upload" label="商品图片">
            <AddPicture gallery={id ? productDetail.gallery : ''} />
          </Form.Item>
        </Card>
        <Card className={styles.cardBox} loading={loading}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}> 商品详情</div>

          {(productDetail.ID || isAdd) && (
          <Form.Item
            wrapperCol={{
              span: 24,
              // offset: 6,
            }}
            name="description" 
            initialValue={id &&productDetail?.post_content}
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
            loading={loading} 
            style={{ marginRight: '15px' }} 
            type="primary"
            disabled={(getFieldsValue && getFieldError('name')[0]) || !isDiff}
            >
              保存
            </Button>
            <Button loading={loading}>取消</Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default connect((state) => ({
  productDetail: state.product.productDetail,
  loading: state.loading.effects['product/fetchProductDetail'],
  // updateLoading: state.loading.effects['categories/batchDel'],
}))(ProductDetail);
