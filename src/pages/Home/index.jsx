import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import Statistics from './Statistics';
import OrderTrend from './OrderTrend';
import Sales from './Sales';
import User from './User';
import styles from './styles.less';

@connect(({ user, home, loading }) => ({
  reportsOrdersList: home.reportsOrdersList,
  hotProductsList: home.hotProductsList,
  reportsSalesList: home.reportsSalesList,
  reportsVisitsList: home.reportsVisitsList,
  query: home.query,
  summaryData: user.summaryData,
  ordersLoading: loading.effects['home/reportsOrdersFetch'],
  hotProductsLoading: loading.effects['home/reportsHotProductsFetch'],
  salesLoading: loading.effects['home/home/reportsSalesFetch'],
  visitsLoading: loading.effects['home/reportsVisitsFetch'],
}))
class Home extends Component {
  async componentDidMount() {
    const { dispatch } = this.props;
    const date = JSON.parse(sessionStorage.getItem('reportsOrdersQuery')) || {};
    const startDay = date['filter[start]'];
    const endDay = date['filter[end]'];

    // 今天
    const today = new Date();
    today.setTime(today.getTime());
    const todays = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    // 明天的时间
    const tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);
    const tomorrows = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

    // 订单
    await dispatch({
      type: 'home/reportsOrdersFetch',
      payload: {
        'filter[start]': startDay || todays,
        'filter[end]': endDay || tomorrows,
        // ...query
      },
      save: true,
    });
    // 商品销售额
    await dispatch({
      type: 'home/reportsHotProductsFetch',
      payload: {
        'filter[start]': startDay || todays,
        'filter[end]': endDay || tomorrows,
      },
    });
    // 销售额
    await dispatch({
      type: 'home/reportsSalesFetch',
      payload: {
        'filter[start]': todays,
        'filter[end]': tomorrows,
      },
    });
    // 访客
    await dispatch({
      type: 'home/reportsVisitsFetch',
      payload: {
        'filter[start]': todays,
        'filter[end]': tomorrows,
      },
    });
  }

  async componentWillUnmount() {
    sessionStorage.removeItem('reportsOrdersQuery');
  }

  render() {
    const {
      summaryData,
      reportsOrdersList,
      hotProductsList,
      reportsSalesList,
      reportsVisitsList,
      ordersLoading,
      hotProductsLoading,
      salesLoading,
      visitsLoading,
    } = this.props;
    // const loading = ordersLoading || hotProductsLoading || salesLoading || visitsLoading;
    return (
      <>
        <Statistics summaryData={summaryData} />
        <OrderTrend
          reportsOrdersList={reportsOrdersList}
          hotProductsList={hotProductsList}
          ordersLoading={ordersLoading}
          hotProductsLoading={hotProductsLoading}
        />
        <Row gutter={[16, 16]} className={styles.home}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <User reportsVisitsList={reportsVisitsList} visitsLoading={visitsLoading} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Sales reportsSalesList={reportsSalesList} salesLoading={salesLoading} />
          </Col>
        </Row>
      </>
    );
  }
}

export default Home;
