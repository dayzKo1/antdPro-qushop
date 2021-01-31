import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import Statistics from './Statistics';
import OrderTrend from './OrderTrend';
import Sales from './Sales';
import User from './User';
import styles from './styles.less';

@connect(({ user }) => ({
  summaryData: user.summaryData,
}))
class Home extends Component {
  async componentDidMount() {
    const { summaryData } = this.props;
    console.log('summaryData', summaryData);
  }

  render() {
    const { summaryData } = this.props;
    return (
      <>
        <Statistics summaryData={summaryData} />
        <OrderTrend />
        <Row gutter={[16, 16]} className={styles.home}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Sales />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <User />
          </Col>
        </Row>
      </>
    );
  }
}

export default Home;
