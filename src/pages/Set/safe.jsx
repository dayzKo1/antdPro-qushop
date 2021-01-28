import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import Grid from '@/components/Grid';
import { connect } from 'dva';
import style from './style.less';

class Safe extends React.Component {
  render() {
    const onFinish = (values) => {
      console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <Grid>
        <h4 style={{ fontSize: 17, fontWeight: 600 }}>修改密码</h4>
        <div className={style.safe}>
          <Form
            // {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row className={style.rows}>
              <Col xs={4} className={style.letfCols}>
                当前密码:
              </Col>
              <Col xs={12} className={style.rightCols}>
                <Form.Item name="username" rules={[{ message: 'Please input your username!' }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={style.rows}>
              <Col xs={4} className={style.letfCols}>
                新密码:
              </Col>
              <Col xs={12} className={style.rightCols}>
                <Form.Item name="password" rules={[{ message: 'Please input your username!' }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={style.rows}>
              <Col xs={4} className={style.letfCols}>
                确认新密码:
              </Col>
              <Col xs={12} className={style.rightCols}>
                <Form.Item name="password2" rules={[{ message: 'Please input your username!' }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={style.rows}>
              <Col xs={12} offset={4} className={style.submit}>
                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Grid>
    );
  }
}

export default connect((state) => ({
  set: state.user.a,
}))(Safe);
