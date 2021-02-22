import React, { Component } from 'react';
import { Form, Input, Button, Switch, Card, message } from 'antd';
import { connect } from 'dva';
import payment from '@/assets/pay.png';
import style from '@/global.less';
import styles from './style.less';

@connect(({ setting, loading }) => ({
  savePayment: setting.savePayment,
  loading: loading.effects['setting/queryPaymentData'],
  updateLoading: loading.effects['setting/updateQueryPayment'],
}))
class Payment extends Component {
  state = {
    status: false,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'setting/queryPaymentData' });
    const url = window.location.search.replace('mode=development', '');
    // const url =
    //   '?gateway=paypal|sandbox|1&merchantId=d39b9874a1706ca2ec93a03965400f20&merchantPayerId=BKN3NM89G8NSN&api_style=signature&api_username=1934879001_api12312311.qq.com&api_password=HTD87MY87HMTQLCW&signature=AJEpniSzu9.5jxsR6vky9-LO53rhAO1bUshlpWkdavasEDLgTJlQtAzT';
    if (url && url !== '?') {
      const urlArr = url.substr(1).split('&');
      const urlObj = {};
      urlArr.forEach((item) => {
        const arr = item?.split('=');
        const [key, value] = arr;
        urlObj[key] = value;
      });
      const gateway = urlObj.gateway.split('|');
      try {
        await dispatch({
          type: 'setting/updateQueryPayment',
          payload: {
            api_username: urlObj.api_username,
            api_password: urlObj.api_password,
            api_signature: urlObj.signature,
            sandbox: gateway[1] === 'sandbox',
            code: gateway[0],
          },
          id: gateway[2],
        });
        // await router.push('/settings/payment');
        message.success('设置成功');
      } catch (e) {
        // if (e.response && e.response.status === 422) {
        //   const msg = e.response.data.errors;
        //   const warn = Object.values(msg);
        //   message.warning(warn[0]);
        // }
      }
    }
  }

  formRef = React.createRef();

  save = async (values) => {
    const { savePayment } = this.props;
    console.log('values', values);
    const item = (savePayment?.data?.length && savePayment?.data[0]) || {};
    const { dispatch } = this.props;
    try {
      await dispatch({
        type: 'setting/updateQueryPayment',
        payload: {
          ...item,
          api_password: values.apiPassword,
          api_signature: values.apiSignature,
          api_username: values.apiUsername,
          ...values[item?.code],
        },
        id: item?.id,
      });
      message.success('绑定成功');
    } catch (e) {
      if (e.response && e.response.status === 422) {
        const msg = e.response.data.errors;
        const warn = Object.values(msg);
        message.warning(warn[0]);
      }
    }
  };

  toggle = async (ee, item) => {
    const { dispatch } = this.props;
    const { id } = item;
    try {
      await dispatch({
        type: 'setting/updateQueryPayment',
        payload: {
          ...item,
          enabled: ee ? 'yes' : 'no',
        },
        id,
      });
    } catch (e) {
      if (e.response && e.response.status === 422) {
        const msg = e.response.data.errors;
        const warn = Object.values(msg);
        message.warning(warn[0]);
      }
    }
  };

  render() {
    const { savePayment, loading, fmItem, updateLoading } = this.props;
    const { isFieldsTouched, getFieldValue } = this.formRef.current || {};
    const aStyle = {
      cursor: 'default',
      textDecoration: 'none',
    };
    const item = (savePayment?.data?.length && savePayment?.data[0]) || {};
    console.log('this.formRef.current', this.formRef.current, isFieldsTouched && isFieldsTouched());
    return (
      <div>
        <Form
          ref={this.formRef}
          onFinish={this.save}
          onFieldsChange={() => {
            const { status } = this.state;
            this.setState({
              status: !status,
            });
          }}
        >
          <Card
            loading={loading}
            className={style.cardbox}
            style={{ marginBottom: 20 }}
            key="paypal"
          >
            <div className={styles.content} style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>快速结账</span>
              <span>
                <img alt="payment" src={payment} style={{ marginTop: 12, marginRight: 12 }} />
              </span>
            </div>
            <div className={styles.box} style={{ padding: 12 }}>
              <div>
                <Switch
                  onChange={(e) => {
                    this.toggle(e, item);
                  }}
                  defaultChecked={item?.enabled === 'yes'}
                  loading={updateLoading}
                />
                <span style={{ padding: '10px', fontSize: '18px', fontWeight: '600' }}>
                  Sandbox
                </span>
              </div>
              <div className={styles.paybox}>
                <div className={styles.payboxL}>
                  <Form.Item
                    label="Username"
                    style={fmItem}
                    name="apiUsername"
                    initialValue={item?.api_username}
                    rules={[
                      {
                        required: true,
                        message: '请输入 Username',
                      },
                    ]}
                  >
                    <Input placeholder="请输入 Username" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    style={fmItem}
                    name="apiPassword"
                    initialValue={item?.api_password}
                    rules={[
                      {
                        required: true,
                        message: '请输入 Password',
                      },
                    ]}
                  >
                    <Input placeholder="请输入 Password" />
                  </Form.Item>
                  <Form.Item
                    label="Signature"
                    style={fmItem}
                    name="apiSignature"
                    initialValue={item?.api_signature}
                    rules={[
                      {
                        required: true,
                        message: '请输入 Signature',
                      },
                    ]}
                  >
                    <Input placeholder="请输入 Signature" />
                  </Form.Item>
                  <Button
                    type="primary"
                    loading={updateLoading}
                    disabled={isFieldsTouched && !isFieldsTouched()}
                    style={{
                      position: 'relative',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                    htmlType="submit"
                  >
                    绑定
                  </Button>
                </div>
                <div style={{ flex: 1, padding: 12, paddingLeft: 24 }}>
                  <h3 style={{ fontSize: 14, marginTop: 48 }}>个人账号快速绑定指引 </h3>
                  {getFieldValue && getFieldValue('paypal.sandbox') ? (
                    <a href={item?.ppec_sandbox} style={aStyle}>
                      设置或关联已存在的paypal沙盒账户
                    </a>
                  ) : (
                    <a href={item?.ppec_live} style={aStyle}>
                      设置或关联已存在的paypal账户
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Form>
      </div>
    );
  }
}

export default Payment;
