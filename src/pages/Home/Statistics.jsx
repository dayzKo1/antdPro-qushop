import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ChartCard from '@/components/ChartCard';
import Order from '@/assets/home/order.png';
import UfilledOrder from '@/assets/home/ufilledOrder.png';
import User from '@/assets/home/user.png';
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
            detail={
              <div
                style={{
                  fontSize: '10px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '9px',
                }}
              >
                <span>周同比</span>

                <CaretUpOutlined style={{ color: '#52c41aa5' }} />
                <span>日环比</span>
                <CaretDownOutlined style={{ color: '#f5222d' }} />
              </div>
            }
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="订单数量"
            value="090"
            today="今日新增"
            todayVal="21201"
            detail={<img alt={User} src={User} style={{ width: '100%' }} />}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="用户总数"
            value="90"
            today="今日新增"
            todayVal="21201"
            detail={<img alt={Order} src={Order} style={{ width: '100%' }} />}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="未发货订单数"
            value="1090"
            today="发货完成率"
            todayVal="2101"
            detail={
              <img
                alt={UfilledOrder}
                src={UfilledOrder}
                style={{ width: '100%', marginTop: '8px' }}
              />
            }
          />
        </Col>
      </Row>
    );
  }
}

export default Statistics;
