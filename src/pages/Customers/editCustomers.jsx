import React, { Component } from 'react';
import { Card, Empty, Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import currencyFormatter from 'currency-formatter';
import Grid from '@/components/Grid';
import BasicHeader from '@/components/BasicHeader';
import BackTop from '@/components/BackTop';
import TableFooter from '@/components/TableFooter';
import defaultImg from '@/assets/defaultImg.png';
import SelectAddress from './SelectAddress';
import styles from './style.less';

const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/zh.json'));
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

class CustomerDetail extends Component {
  state = {
    defaultAddress: {},
    hiddenMore: false,
    currentPage: 1,
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'customers/fetchCustomerOrders',
      id,
      payload: {
        page_size: 5,
      },
    });
    this.initData(id);
  }

  // 分页
  changePage = (page, prePage) => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    this.setState({
      currentPage: page,
    });
    dispatch({
      type: 'customers/fetchCustomerOrders',
      id,
      payload: {
        page,
        page_size: prePage,
      },
    });
  };

  // 初始化数据
  initData = async (id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'customers/fetchCustomerDetail',
      payload: {
        id,
      },
    });
    this.showDefAddress(res);
  };

  showMore = () => {
    const { hiddenMore } = this.state;
    this.setState({
      hiddenMore: !hiddenMore,
    });
  };

  // 取到数据后选取默认地址展示;
  showDefAddress = (res) => {
    const addressBook = res.address_book;
    addressBook.forEach((item) => {
      if (item?.default) {
        this.setState({
          defaultAddress: item,
        });
      }
    });
  };

  // 点击订单号跳转到订单页面
  jumpToOrder = (id) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/order/allOrder/${id}` }));
  };

  // 计算订单商品总税收
  productsTax = (arr) => {
    let tax = 0;
    if (arr.length !== 0) {
      arr.map((item) => {
        tax += parseFloat(item?.line_tax);
        return 0;
      });
    }
    return tax;
  };

  render() {
    const { detail, loading, customerOrders, orderLoading, setLoading, symbol } = this.props;
    const { defaultAddress, currentPage } = this.state;
    return (
      <Grid>
        <BackTop title="顾客列表" href="/customers" />
        <BasicHeader title="顾客详情" />
        <Row gutter={20}>
          <Col span={16}>
            <Card loading={loading || setLoading} className={styles.cardbox}>
              <div className={styles.title}>
                <span>顾客信息</span>
              </div>
              <div className={styles.content}>
                <div>
                  <span>姓名</span>
                  <div>
                    {detail?.display_name}
                    {detail?.subscribed && <span className={styles.subscription}>已订阅</span>}
                  </div>
                </div>
                <div>
                  <span>电话</span>
                  <div>{detail?.phone}</div>
                </div>
                <div>
                  <span>城市</span>
                  <div>
                    {detail?.shipping_address && detail?.shipping_address.city}&nbsp;&nbsp;
                    {detail?.shipping_address &&
                      countries.getName(detail?.shipping_address.country, 'en')}
                  </div>
                </div>
                <div>
                  <span>邮箱</span>
                  <div>{detail?.user_email}</div>
                </div>
                <div>
                  <span>顾客类型</span>
                  <div>{detail?.type === 'registered' ? '注册会员' : '非注册会员'}</div>
                </div>
                <div>
                  <span>加入时间</span>
                  <div>{detail?.user_registered}</div>
                </div>
                <div>
                  <span style={{ lineHeight: '2.2', margin: 'auto' }}>总单量</span>
                  <div style={{ margin: 'auto' }}>{detail?.order_count}</div>
                </div>
                <div style={{ borderBottom: 'none' }}>
                  <span>总花费</span>
                  <div>{symbol + (detail?.order_total * 1).toFixed(2)}</div>
                </div>
              </div>
            </Card>
            <Card loading={loading || setLoading} className={styles.historyOrder}>
              <div className={styles.title}>历史订单</div>
              {customerOrders?.data && customerOrders?.data.length > 0 ? (
                <>
                  {!orderLoading ? (
                    <>
                      {customerOrders?.data.map((orderItem) => (
                        <div key={orderItem?.ID}>
                          <div className={`${styles.orderInfo}`}>
                            <span>
                              订单编号
                              <span onClick={(e) => this.jumpToOrder(orderItem?.ID, e)}>
                                {orderItem?.number}
                              </span>
                            </span>
                            <span style={{ float: 'right' }}>{orderItem?.post_date}</span>
                          </div>
                          <div className={styles.tableWrap}>
                            <table>
                              <tbody>
                                {orderItem?.line_items.map((item) => (
                                  <tr key={item?.order_item_id}>
                                    <td style={{ width: 70 }}>
                                      <div
                                        style={{
                                          height: 50,
                                          width: 50,
                                          border: '1px solid #dadde4',
                                          backgroundSize: '100% 100%',
                                          backgroundImage: `url(${
                                            (item?.feature_image && item?.feature_image.medium) ||
                                            defaultImg
                                          })`,
                                        }}
                                      />
                                    </td>
                                    <td style={{ width: 220 }}>
                                      <div
                                        className={styles.name}
                                        onClick={(e) => this.jumpToOrder(orderItem?.ID, e)}
                                      >
                                        {item?.order_item_name}
                                      </div>
                                      <div className={styles.sku}>
                                        SKU：
                                        {item?.sku}
                                      </div>
                                    </td>
                                    <td style={{ width: 162, textAlign: 'center' }}>
                                      {item?.attrs &&
                                        Object.values(item?.attrs)
                                          .filter((i) => i.length > 0)
                                          .join('·')}
                                    </td>
                                    <td style={{ width: 100 }}>
                                      {currencyFormatter.findCurrency(orderItem?.order_currency)
                                        ? currencyFormatter.findCurrency(orderItem?.order_currency)
                                            .symbol
                                        : symbol}
                                      {(item?.price * 1).toFixed(2, 10)} *{item?.qty}
                                    </td>
                                    <td style={{ width: 90 }}>
                                      {currencyFormatter.findCurrency(orderItem?.order_currency)
                                        ? currencyFormatter.findCurrency(orderItem?.order_currency)
                                            .symbol
                                        : symbol}
                                      {(item?.line_subtotal * 1).toFixed(2, 10)}{' '}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className={styles.spinWrap}>
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
                    </div>
                  )}
                  <TableFooter
                    total={customerOrders?.total}
                    changePage={this.changePage}
                    currentPage={currentPage}
                    perPage={customerOrders?.per_page}
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={['5', '10', '25', '50']}
                  />
                </>
              ) : (
                <Empty />
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card loading={loading || setLoading} className={styles.cardbox}>
              <div className={styles.title}>收货地址</div>
              {defaultAddress && (
                <div className={styles.address}>
                  <div>
                    <span>姓名：</span>
                    <span>
                      {(defaultAddress.first_name || defaultAddress.last_name) &&
                        `${defaultAddress.first_name || ''} ${
                          defaultAddress.last_name || ''
                        }`.replace(/(^\s*)|(\s*$)/g, '')}
                      {!defaultAddress.first_name && !defaultAddress.last_name && '--'}
                    </span>
                    <span className={styles.addressTip}>默认地址</span>
                  </div>
                  <div>
                    <span>电话：</span>
                    <span>{defaultAddress.phone || '--'}</span>
                  </div>
                  <div>
                    <span>地址：</span>
                    <span>
                      {defaultAddress.address_1 ? defaultAddress.address_1 : '--'}
                      {defaultAddress.address_2 && `，${defaultAddress.address_2}`}
                      {defaultAddress.city && `，${defaultAddress.city}`}
                      {defaultAddress.state_name && `，${defaultAddress.state_name.split('/')[0]}`}
                      {defaultAddress.country &&
                        `，${countries.getName(defaultAddress.country, 'zh')}`}
                    </span>
                  </div>
                  <div>
                    <span>邮编：</span>
                    <span>{defaultAddress.postcode || '--'}</span>
                  </div>
                  <SelectAddress
                    initData={this.initData}
                    id={detail?.ID}
                    addressBook={detail?.address_book}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(({ customers, loading, setting }) => ({
  detail: customers.customerDetail,
  customerOrders: customers.customerOrders,
  symbol: setting.symbol,
  loading: loading.effects['customers/fetchCustomerDetail'],
  orderLoading: loading.effects['customers/fetchCustomerOrders'],
  setLoading: loading.effects['setting/querySettingBase'],
}))(CustomerDetail);
