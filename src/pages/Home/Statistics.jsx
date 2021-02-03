import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ChartCard from '@/components/ChartCard';
import currencyFormatter from 'currency-formatter';
import Order from '@/assets/home/order.png';
import UfilledOrder from '@/assets/home/ufilledOrder.png';
import User from '@/assets/home/user.png';
import styles from './styles.less';

class Statistics extends Component {
  render() {
    const { summaryData } = this.props;
    return (
      <Row gutter={[16, 16]} className={styles.home}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="总销售额"
            value={`${
              currencyFormatter?.findCurrency(summaryData?.base?.currency)?.symbol || '$'
            } ${summaryData?.base?.sales}`}
            today="日均销售额"
            todayVal="$ 123"
            detail={
              <div
                style={{
                  fontSize: '10px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginTop: '9px',
                }}
              >
                <div style={{ marginRight: '10px' }}>
                  <span>周同比</span>
                  <CaretUpOutlined style={{ color: '#52c41aa5' }} />
                  <span>12%</span>
                </div>
                <div>
                  <span>日环比</span>
                  <CaretDownOutlined style={{ color: '#f5222d' }} />
                  <span>12%</span>
                </div>
              </div>
            }
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="订单数量"
            value={summaryData?.base?.orders}
            today="今日新增"
            todayVal="0"
            detail={<img alt={User} src={User} style={{ width: '100%' }} />}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="商品访客数"
            value={summaryData?.base?.visits}
            today="今日新增"
            todayVal="0"
            detail={<img alt={Order} src={Order} style={{ width: '100%' }} />}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <ChartCard
            title="未发货订单数"
            value={summaryData?.order?.unfulfilled}
            today="发货完成率"
            todayVal="1%"
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
