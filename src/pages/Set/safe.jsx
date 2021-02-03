import React from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import Grid from '@/components/Grid';
import { connect } from 'dva';
import style from './style.less';

const Safe = (props) => {
  const [form] = Form.useForm();
  const { dispatch, loading, outLoading } = props;
  const onFinish = async ({ username, password, password2 }) => {
    try {
      await dispatch({
        type: 'setting/changePassword',
        payload: {
          old_password: username,
          password,
          password_confirmation: password2,
        },
      });
      dispatch({
        type: 'login/logout',
      });
    } catch (error) {
      if (error && error.status_code === 422) {
        const msg = error.errors;
        const warn = Object.values(msg);
        message.warning(warn[0]);
      }
    }
  };

  const password = (_, val, callback) => {
    if (!val) {
      callback('请输入新密码');
      return;
    }
    const reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
    if (!reg.test(val)) {
      callback('6-20位英文+数字组合的密码');
    }
    if (val === form.getFieldValue('username')) {
      callback('与旧密码相同!');
    }
    callback();
  };

  const passwordTwo = (_, val, callback) => {
    if (!val) {
      callback('请再次输入新密码');
      return;
    }
    if (val !== form.getFieldValue('password')) {
      callback('两次输入密码不一致!');
    }
    callback();
  };

  return (
    <Grid>
      <h4 style={{ fontSize: 17, fontWeight: 600 }}>修改密码</h4>
      <div className={style.safe}>
        <Form
          // {...layout}
          form={form}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Row className={style.rows}>
            <Col xs={4} className={style.letfCols}>
              旧密码:
            </Col>
            <Col xs={12} className={style.rightCols}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '6-20位英文数字组合' },
                  { min: 6, message: '最少输入6位密码' },
                ]}
              >
                <Input.Password size="large" placeholder="请输入旧密码" />
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.rows}>
            <Col xs={4} className={style.letfCols}>
              新密码:
            </Col>
            <Col xs={12} className={style.rightCols}>
              <Form.Item name="password" rules={[{ validator: password }]}>
                <Input.Password size="large" placeholder="请输入新密码" />
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.rows}>
            <Col xs={4} className={style.letfCols}>
              确认新密码:
            </Col>
            <Col xs={12} className={style.rightCols}>
              <Form.Item name="password2" rules={[{ validator: passwordTwo }]}>
                <Input.Password size="large" placeholder="请再次输入新密码" />
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.rows}>
            <Col xs={12} offset={4} className={style.submit}>
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={loading || outLoading}
                >
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Grid>
  );
};

export default connect((state) => ({
  loading: state.loading.effects['setting/changePassword'],
  outLoading: state.loading.effects['setting/changePassword'],
  // changePassword: state.set.changePassword,
}))(Safe);
