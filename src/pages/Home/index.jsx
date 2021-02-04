import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import Grid from '@/components/Grid';
import Statistics from './Statistics';
import OrderTrend from './OrderTrend';
import Sales from './Sales';
import Visits from './Visits';
import styles from './styles.less';

@connect(({ user, home, loading }) => ({
  reportsOrdersList: home.reportsOrdersList,
  hotProductsList: home.hotProductsList,
  visitSalesList: home.visitSalesList,
  // reportsVisitsList: home.reportsVisitsList,
  query: home.query,
  summaryData: user.summaryData,
  ordersLoading: loading.effects['home/reportsOrdersFetch'],
  hotProductsLoading: loading.effects['home/reportsHotProductsFetch'],
  salesVisitsLoading: loading.effects['home/reportsFetch'],
  // visitsLoading: loading.effects['home/reportsVisitsFetch'],
}))
class Home extends Component {
  async componentDidMount() {
    const { dispatch } = this.props;
    // 今天
    const today = new Date();
    today.setTime(today.getTime());
    const todays = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // 订单
    await dispatch({
      type: 'home/reportsOrdersFetch',
      payload: {
        'filter[start]': `${todays} 00:00:00`,
        'filter[end]': `${todays} 23:59:59`,
        // ...query
      },
      save: true,
    });
    // 商品销售额
    await dispatch({
      type: 'home/reportsHotProductsFetch',
      payload: {
        'filter[start]': `${todays} 00:00:00`,
        'filter[end]': `${todays} 23:59:59`,
        // ...query
      },
    });
    // 销售额 访客
    await dispatch({
      type: 'home/reportsFetch',
      payload: {
        'filter[start]': `${todays} 00:00:00`,
        'filter[end]': `${todays} 23:59:59`,
        // ...query
      },
    });
  }

  render() {
    const {
      summaryData,
      reportsOrdersList,
      hotProductsList,
      visitSalesList,
      ordersLoading,
      hotProductsLoading,
      salesVisitsLoading,
    } = this.props;

    const OrdersList =
      reportsOrdersList && reportsOrdersList.length > 0
        ? reportsOrdersList.filter((item) => item.type === 'orders')
        : {};
    const reportsVisitsList =
      visitSalesList && visitSalesList.length > 0
        ? visitSalesList.filter((item) => item.type === 'visits')
        : {};
    const reportsSalesList =
      visitSalesList && visitSalesList.length > 0
        ? visitSalesList.filter((item) => item.type === 'sales')
        : {};
    return (
      <Grid>
        <Statistics summaryData={summaryData} />
        <OrderTrend
          reportsOrdersList={OrdersList}
          hotProductsList={hotProductsList}
          ordersLoading={ordersLoading}
          hotProductsLoading={hotProductsLoading}
        />
        <Row gutter={[16, 16]} className={styles.home}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Visits reportsVisitsList={reportsVisitsList} visitsLoading={salesVisitsLoading} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Sales reportsSalesList={reportsSalesList} salesLoading={salesVisitsLoading} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Home;
