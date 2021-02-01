import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
// import Grid from '@/components/Grid';
import { connect } from 'dva';
// import style from "./style.less"

const Searchs = (props) => {
  const [form] = Form.useForm();
  const { loading, query, dispatch } = props;
  const handleSubmit = ({ search }) => {
    dispatch({
      type: 'categories/queryCategories',
      payload: {
        ...query,
        filter: {
          ...query?.filter,
          name: search || undefined,
        },
      },
    });
  };

  const resetting = () => {
    form.resetFields();
    dispatch({
      type: 'categories/queryCategories',
    });
  };
  return (
    <div style={{ margin: '10px 0 30px' }}>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={{ xxl: 16, xl: 8, lg: 8 }} style={{ display: 'flex' }}>
          <Col xs={10} style={{ flex: 'auto' }}>
            <Form.Item name="search">
              <Input placeholder="请输入分类名称" />
            </Form.Item>
          </Col>
          <Col>
            <Button loading={loading} type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
          <Col>
            <Button loading={loading} onClick={() => resetting()}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect((state) => ({
  categoriesData: state.categories.categoriesData,
  query: state.categories.query,
  loading: state.loading.effects['categories/queryCategories'],
}))(Searchs);
