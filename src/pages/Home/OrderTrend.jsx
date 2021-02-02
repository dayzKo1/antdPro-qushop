import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Row, Col, DatePicker, Badge, Empty } from 'antd';
import { Chart, Interval, Tooltip } from 'bizcharts';
// import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import styles from './styles.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ home }) => ({
  query: home.query,
}))
class OrderTrend extends Component {
  state = {
    startDate: undefined,
    endDate: undefined,
  };

  render() {
    const {
      reportsOrdersList = {},
      hotProductsList = {},
      ordersLoading,
      hotProductsLoading,
    } = this.props;
    const operations = <RangePicker locale={locale} />;

    return (
      <Card className={styles.home} loading={ordersLoading || hotProductsLoading}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
          <TabPane tab="订单趋势" key="1">
            <Row gutter={16}>
              <Col span={16}>
                <p className={styles.tableTitle}>订单增长趋势</p>
                <Chart
                  height={300}
                  autoFit
                  data={reportsOrdersList && reportsOrdersList.data}
                  interactions={['active-region']}
                  padding="auto"
                >
                  <Interval position="year*value" />
                  <Tooltip />
                </Chart>
              </Col>
              <Col span={8}>
                <p className={styles.tableTitle}>商品销售数排名</p>
                {hotProductsList && hotProductsList?.data?.length > 0 ? (
                  hotProductsList &&
                  hotProductsList.data.map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          padding: '10px 0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Badge
                            count={index + 1}
                            style={{ marginRight: '10px' }}
                            className={index + 1 > 3 ? styles.badgeCount : styles.badgeCount_3}
                          />
                          {/* <span style={{ marginRight: '10px' }}>{index + 1}</span> */}
                          <span> {item.title}</span>
                        </div>
                        <div> {item.qty}</div>
                      </div>
                    );
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default OrderTrend;
