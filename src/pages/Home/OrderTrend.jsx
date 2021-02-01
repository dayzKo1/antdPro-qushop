import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Row, Col, DatePicker, Badge } from 'antd';
import { Chart, Interval } from 'bizcharts';
import moment from 'moment';
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

  // 时间筛选
  changeDate = async (_, dateStrings) => {
    const day = new Date();
    day.setTime(day.getTime());
    const s = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
    // 明天的时间
    const day3 = new Date();
    day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    const s3 = `${day3.getFullYear()}-${day3.getMonth() + 1}-${day3.getDate()}`;
    const startDate = dateStrings[0] ? dateStrings[0] : s;
    const endDate = dateStrings[1] ? dateStrings[1] : s3;
    const { dispatch } = this.props;
    // 订单趋势
    await dispatch({
      type: 'home/reportsOrdersFetch',
      payload: {
        // ...query,
        'filter[start]': startDate,
        'filter[end]': endDate,
      },
      save: true,
    });
    // 商品销售额
    await dispatch({
      type: 'home/reportsHotProductsFetch',
      payload: {
        'filter[start]': startDate,
        'filter[end]': endDate,
      },
    });
    this.setState({
      startDate,
      endDate,
    });
  };

  render() {
    const {
      reportsOrdersList = {},
      hotProductsList = {},
      query = {},
      ordersLoading,
      hotProductsLoading,
    } = this.props;
    const ordersData = reportsOrdersList?.data;
    const { startDate, endDate } = this.state;

    const operations = (
      <RangePicker
        locale={locale}
        value={
          [moment(startDate), moment(endDate)] || [
            moment(query['filter[start]']),
            moment(query['filter[end]']),
          ]
        }
        onChange={this.changeDate}
      />
    );

    return (
      <Card className={styles.home} loading={hotProductsLoading || ordersLoading}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
          <TabPane tab="订单趋势" key="1">
            <Row>
              <Col span={16}>
                <p className={styles.tableTitle}>订单增长趋势</p>
                <Chart height={300} autoFit data={ordersData}>
                  <Interval position="datetime*value" />
                </Chart>
              </Col>
              <Col span={8}>
                <p className={styles.tableTitle}>商品销售数排名</p>
                {hotProductsList && hotProductsList?.data?.length > 0
                  ? hotProductsList &&
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
                  : ''}
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default OrderTrend;
