import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ChartCard from '@/components/ChartCard';
import styles from './styles.less';

class Statistics extends Component {
  render() {
    const { summaryData } = this.props;
    console.log(summaryData?.base?.sales);
    return (
      <Row gutter={[16, 16]} className={styles.home}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="总销售额"
            value={summaryData?.base?.sales}
            today="日均销售额"
            todayVal="¥ 12,423"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard title="订单数量" value="090" today="今日新增" todayVal="21201" />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard title="用户总数" value="90" today="今日新增" todayVal="21201" />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard title="未发货订单数" value="1090" today="发货完成率" todayVal="2101" />
        </Col>
      </Row>
    );
  }
}

export default Statistics;
