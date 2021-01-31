import React, { Component } from 'react';
import { Card, Tabs, Row, Col, DatePicker } from 'antd';
import { Chart, Interval } from 'bizcharts';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import styles from './styles.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

class OrderTrend extends Component {
  render() {
    const data = [
      { year: '1951 年', sales: 38 },
      { year: '1952 年', sales: 52 },
      { year: '1956 年', sales: 61 },
      { year: '1957 年', sales: 45 },
      { year: '1958 年', sales: 48 },
      { year: '1959 年', sales: 38 },
      { year: '1960 年', sales: 38 },
      { year: '1962 年', sales: 38 },
    ];

    const date = '';
    const startDate = '';
    const endDate = '';

    const operations = (
      <RangePicker
        locale={locale}
        value={date ? [moment(startDate), moment(endDate)] : []}
        // onChange={this.changeDate}
      />
    );

    return (
      <Card className={styles.home}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
          <TabPane tab="订单趋势" key="1">
            <Row>
              <Col span={16}>
                <span className={styles.tableTitle}>订单增长趋势</span>
                <Chart height={300} autoFit data={data}>
                  <Interval position="year*sales" />
                </Chart>
              </Col>
              <Col span={8}>
                <span className={styles.tableTitle}>商品销售数排名</span>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default OrderTrend;
