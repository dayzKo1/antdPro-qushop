import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, LineAdvance } from 'bizcharts';

const { TabPane } = Tabs;

class Sales extends Component {
  render() {
    const { salesLoading } = this.props;
    const reportsSalesList = {
      data: [
        {
          month: '00:00',
          city: '21-02-02',
          temperature: 427,
        },
        {
          month: '00:00',
          city: '21-02-01',
          temperature: 339,
        },
        {
          month: '01:00',
          city: '21-02-02',
          temperature: 216,
        },
        {
          month: '01:00',
          city: '21-02-01',
          temperature: 432,
        },
        {
          month: '02:00',
          city: '21-02-02',
          temperature: 129,
        },
        {
          month: '02:00',
          city: '21-02-01',
          temperature: 145,
        },
        {
          month: '03:00',
          city: '21-02-02',
          temperature: 144,
        },
        {
          month: '03:00',
          city: '21-02-01',
          temperature: 98,
        },
        {
          month: '04:00',
          city: '21-02-02',
          temperature: 198,
        },
        {
          month: '04:00',
          city: '21-02-01',
          temperature: 191,
        },
        {
          month: '05:00',
          city: '21-02-02',
          temperature: 291,
        },
        {
          month: '05:00',
          city: '21-02-01',
          temperature: 195,
        },
        {
          month: '06:00',
          city: '21-02-02',
          temperature: 255,
        },
        {
          month: '06:00',
          city: '21-02-01',
          temperature: 167,
        },
        {
          month: '07:00',
          city: '21-02-02',
          temperature: 246,
        },
        {
          month: '07:00',
          city: '21-02-01',
          temperature: 126,
        },
        {
          month: '08:00',
          city: '21-02-02',
          temperature: 233,
        },
        {
          month: '08:00',
          city: '21-02-01',
          temperature: 124,
        },
        {
          month: '09:00',
          city: '21-02-02',
          temperature: 18,
        },
        {
          month: '09:00',
          city: '21-02-01',
          temperature: 130,
        },
        {
          month: '10:00',
          city: '21-02-02',
          temperature: 133,
        },
        {
          month: '10:00',
          city: '21-02-01',
          temperature: 6,
        },
        {
          month: '11:00',
          city: '21-02-02',
          temperature: 91,
        },
        {
          month: '11:00',
          city: '21-02-01',
          temperature: 41,
        },
      ],
    };
    return (
      <Card loading={salesLoading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="销售额日增长" key="1">
            <Chart
              scale={{ temperature: { min: 0 } }}
              padding={[10, 20, 50, 40]}
              autoFit
              height={320}
              data={reportsSalesList && reportsSalesList.data}
            >
              <LineAdvance
                point={{ size: 3 }}
                shape="smooth"
                position="month*temperature"
                color="city"
              />
            </Chart>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default Sales;
