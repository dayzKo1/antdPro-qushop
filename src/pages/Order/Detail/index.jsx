import React, { Component } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Checkbox,
  Modal,
  Table,
  Divider,
  Button,
  Input,
  message,
} from 'antd';
// import Grid from '@/components/Grid';
import defaultImg from '@/assets/defaultImg.png';
import { connect } from 'dva';
import BasicHeader from '@/components/BasicHeader';
// import moment from 'moment';
import momentTimezone from 'moment-timezone';
import currencyFormatter from 'currency-formatter';
import style from '../styles.less';
import styles from '@/global.less';

@connect(({ orders, loading }) => ({
  orderDetail: orders.orderDetail,
  loading: loading.effects['orders/fetchOrderDetail'],
  loadingTrack: loading.effects['orders/updateTrackno'],
}))
class Detail extends Component {
  formRef = React.createRef();

  state = {
    postStatus: undefined,
    fulfillmentStatus: undefined,
    date: undefined,
    search: undefined,
    batchSel: false,
    selectedRowKeys: [],
    selectedRows: [],
    currentPage: 1,
    isModalVisible: false,
    sendemail: true,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    await dispatch({
      type: 'orders/fetchOrderDetail',
      payload: {
        id,
      },
    });
  }

  // 订单状态
  postStatus = (v) => {
    let status;
    switch (v) {
      case 'wc-completed':
        status = '已完成';
        break;
      case 'wc-cancelled':
        status = '已取消';
        break;
      default:
        status = '进行中';
        break;
    }
    return status;
  };

  // 转换订单时间
  changeTime = (times) => {
    // const { settingBase } = this.props;
    const settingBase = {
      timezone_string: 'Asia/Shanghai',
    };
    const t =
      times &&
      momentTimezone(times)
        .tz(settingBase.timezone_string || momentTimezone.tz.guess())
        .format('YYYY-MM-DD HH:mm:ss');
    // const t = times && momentTimezone(times).tz( || momentTimezone.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
    const result = (times && t) || '--';
    // console.log(result)
    return result;
  };

  // 计算总售价
  calcTotal = (data) => {
    let total = 0;
    if (JSON.stringify(data) !== '{}') {
      data.line_items.forEach((child) => {
        total += child.line_subtotal * 1;
      });
    }
    return total.toFixed(2);
  };

  // 计算总折扣
  calcCoupons = (data) => {
    let total = 0;
    if (JSON.stringify(data) !== '{}') {
      data.line_items.forEach((child) => {
        total += child.line_subtotal - child.line_total;
      });
    }
    return total.toFixed(2);
  };

  handleChecked = (e) => {
    this.setState({
      sendemail: e.target.checked,
    });
    console.log(e.target.checked);
  };

  showModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  // ship 发货
  handleShip = async () => {
    const form = this.formRef.current.getFieldsValue();
    const { dispatch } = this.props;
    const { sendemail } = this.state;
    const { id } = this.props.match.params;
    try {
      await dispatch({
        type: 'orders/updateTrackno',
        payload: {
          ...form,
          sendemail,
        },
        id,
      });
      message.success('发货成功');
    } catch (errs) {
      if (errs.response && errs.response.status === 422) {
        const msg = errs.response.data.errors;
        const warn = Object.values(msg)[0];
        message.warning(warn);
      } else {
        throw errs;
      }
    }
    this.handleCancel();
    console.log(form, sendemail);
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  render() {
    const { loading, orderDetail, loadingTrack } = this.props;
    const { isModalVisible, sendemail } = this.state;
    const currency = currencyFormatter?.findCurrency(orderDetail?.order_currency)?.symbol || '$';

    const columns = [
      {
        title: '商品',
        width: '10%',
        dataIndex: 'feature_image.medium',
        render: (v) => (
          <div
            style={{
              height: 50,
              width: 50,
              margin: 0,
              border: '1px solid #dadde4',
              backgroundSize: '100% 100%',
              backgroundImage: `url(${v || defaultImg})`,
            }}
          />
        ),
      },
      {
        title: '',
        width: '30%',
        dataIndex: 'order_item_name',
        render: (v, r) => (
          <span>
            <p>{v}</p>
            <p>SKU： {r.sku}</p>
          </span>
        ),
      },
      {
        title: '规格',
        width: '25%',
        dataIndex: 'attrs',
        render: (v) =>
          v &&
          Object.values(v)
            .filter((i) => i.length > 0)
            .join('·'),
      },
      {
        title: '售价*数量',
        width: '15%',
        dataIndex: 'price',
        render: (v, r) => `${currency} ${v} * ${r.qty}`,
      },
      {
        title: '总售价',
        width: '10%',
        dataIndex: 'line_subtotal',
        render: (v) => `${currency} ${v}`,
      },
      {
        title: '折扣',
        width: '10%',
        // dataIndex: 'address',
        // align: 'right',
        render: (_, r) => (r.line_subtotal - r.line_total).toFixed(2),
      },
    ];

    return (
      <>
        <Modal
          title="填写物流单号"
          visible={isModalVisible}
          confirmLoading={loadingTrack}
          onOk={this.handleShip}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: orderDetail && orderDetail.trackno_source === 'trackhub' }}
        >
          <Form ref={this.formRef} onFinish={this.handleShip}>
            <Form.Item name="trackno">
              <Input placeholder="物流单号" />
            </Form.Item>
            <Form.Item name="trackno">
              <Checkbox onChange={this.handleChecked} checked={sendemail}>
                发消息给顾客
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
        <BasicHeader parent="订单列表" title="/订单详情" parentUrl="/order">
          <Button
            style={{ float: 'right' }}
            loading={loading}
            type="primary"
            size="large"
            onClick={this.showModal}
            disabled={orderDetail?.post_status === 'wc-cancelled'}
          >
            {orderDetail?.fulfillment_status === 'unfulfilled' ? '发货' : '修改发货'}
          </Button>
        </BasicHeader>
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Card className={styles.cardBox} loading={loading}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
                订单总览
              </div>
              <Table
                className={style.detailTable}
                pagination={false}
                columns={columns}
                dataSource={orderDetail.line_items}
                rowKey={(r) => r.product_id}
              />
            </Card>
            <Card className={styles.cardBox} loading={loading}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
                订单总览
              </div>
              <div className={style.detail}>
                <div>
                  <span>小计</span>
                  <div>{orderDetail?.line_items?.length}项</div>
                  <span>
                    {currency} {orderDetail?.order_total && this.calcTotal(orderDetail)}
                  </span>
                </div>
                <div>
                  <span>折扣</span>
                  <div>
                    {orderDetail.coupons &&
                      orderDetail.coupons.map((item) => (
                        <span key={item.order_id}>
                          {item.content === '' && item.order_item_name === 'offer discount'
                            ? 'offer discount'
                            : item.content}
                          &nbsp;&nbsp;
                          {item.auto_coupon && <span style={{ color: '#5e7185' }}>(自动应用)</span>}
                        </span>
                      ))}
                  </div>
                  <span>
                    -{currency} {orderDetail.coupons && this.calcCoupons(orderDetail)}
                  </span>
                </div>
                <div>
                  <span>运费</span>
                  <div>
                    {' '}
                    {orderDetail.shippings &&
                      orderDetail.shippings.map((item) => (
                        <span key={item.order_id}>{item.order_item_name}&nbsp;&nbsp;</span>
                      ))}
                  </div>
                  <span>
                    +{currency}
                    {orderDetail.order_shipping}
                  </span>
                </div>
                {orderDetail.fees && orderDetail.fees[0] && (
                  <div>
                    <span>运费险</span>
                    <div style={{ margin: 'auto' }}>{orderDetail.fees[0].order_item_name}</div>
                    <span className={styles.num}>
                      +{currency + (orderDetail.fees[0].line_total * 1).toFixed(2)}
                    </span>
                  </div>
                )}

                <div>
                  <span>总计</span>
                  <div></div>
                  <span>
                    {currency} {orderDetail?.order_total}
                  </span>
                </div>
              </div>
            </Card>
            <Card className={styles.cardBox} loading={loading}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
                收货地址
              </div>
              <div className={style.detail}>
                <div>
                  <span>姓名</span>
                  <div>
                    {orderDetail?.billing_address?.first_name}{' '}
                    {orderDetail?.billing_address?.last_name}
                  </div>
                </div>
                <div>
                  <span>电话</span>
                  <div>{orderDetail?.billing_address?.phone}</div>
                </div>
                <div>
                  <span>地址</span>
                  <div>
                    {orderDetail?.billing_address?.address_1}，
                    {orderDetail?.billing_address?.address_2}，{orderDetail?.billing_address?.city}
                    ，{orderDetail?.billing_address?.state_name}，
                    {orderDetail?.billing_address?.country}
                  </div>
                </div>
                <div>
                  <span>邮编</span>
                  <div>{orderDetail?.billing_address?.postcode}</div>
                </div>
                <div>
                  <span>邮箱</span>
                  <div>{orderDetail?.billing_address?.email}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={10}>
            <Card className={styles.cardBox} loading={loading}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
                订单信息
              </div>
              <div className={style.detail2}>
                <div>
                  <span>订单状态：</span>
                  <span>{this.postStatus(orderDetail?.post_status)}</span>
                </div>
                <div>
                  <span>订单总额：</span>
                  <span>{orderDetail?.order_total || '--'}</span>
                </div>
                <Divider />
                <div>
                  <span>订单编号：</span>
                  <span>{orderDetail?.number || '--'}</span>
                </div>
                <div>
                  <span>支付编号：</span>
                  <span>{orderDetail?.transaction_id || '--'}</span>
                </div>
                <div>
                  <span>支付渠道：</span>
                  <span>{orderDetail?.payment_method_title || '--'}</span>
                </div>
                <div>
                  <span>生成时间：</span>
                  <span>{orderDetail?.post_date || '--'}</span>
                </div>
                <div>
                  <span>付款时间：</span>
                  <span>{this.changeTime(orderDetail?.paid_date_gmt)}</span>
                </div>
                <div>
                  <span>物流单号：</span>
                  <span>{orderDetail?.trackno || '--'}</span>
                </div>
                <div>
                  <span>发货时间：</span>
                  <span>{orderDetail?.track_date || '--'}</span>
                </div>
                <Divider />
                <div>
                  <span>买家备注：</span>
                  <span>{orderDetail?.note?.length > 0 ? orderDetail?.note : '--'}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default Detail;
