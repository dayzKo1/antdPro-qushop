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
  salesLoading: loading.effects['home/reportsSalesFetch'],
  visitsLoading: loading.effects['home/reportsVisitsFetch'],
}))
class Home extends Component {
  async componentDidMount() {
    const { dispatch } = this.props;
    // 订单
    await dispatch({
      type: 'home/reportsOrdersFetch',
    });
    // 商品销售额
    await dispatch({
      type: 'home/reportsHotProductsFetch',
    });
    // 销售额
    await dispatch({
      type: 'home/reportsSalesFetch',
    });
    // 访客
    await dispatch({
      type: 'home/reportsVisitsFetch',
    });
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
