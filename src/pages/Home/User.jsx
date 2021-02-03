import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, LineAdvance } from 'bizcharts';
// import { Chart, Path } from 'bizcharts';

const { TabPane } = Tabs;

class User extends Component {
  render() {
    const { visitsLoading } = this.props;
    const reportsVisitsList = {
      data: [
        {
          month: '00:00',
          city: '21-02-02',
          temperature: 7,
        },
        {
          month: '00:00',
          city: '21-02-01',
          temperature: 39,
        },
        {
          month: '01:00',
          city: '21-02-02',
          temperature: 6,
        },
        {
          month: '01:00',
          city: '21-02-01',
          temperature: 4,
        },
        {
          month: '02:00',
          city: '21-02-02',
          temperature: 9,
        },
        {
          month: '02:00',
          city: '21-02-01',
          temperature: 5,
        },
        {
          month: '03:00',
          city: '21-02-02',
          temperature: 14,
        },
        {
          month: '03:00',
          city: '21-02-01',
          temperature: 8,
        },
        {
          month: '04:00',
          city: '21-02-02',
          temperature: 18,
        },
        {
          month: '04:00',
          city: '21-02-01',
          temperature: 11,
        },
        {
          month: '05:00',
          city: '21-02-02',
          temperature: 21,
        },
        {
          month: '05:00',
          city: '21-02-01',
          temperature: 15,
        },
        {
          month: '06:00',
          city: '21-02-02',
          temperature: 25,
        },
        {
          month: '06:00',
          city: '21-02-01',
          temperature: 17,
        },
        {
          month: '07:00',
          city: '21-02-02',
          temperature: 26,
        },
        {
          month: '07:00',
          city: '21-02-01',
          temperature: 16,
        },
        {
          month: '08:00',
          city: '21-02-02',
          temperature: 23,
        },
        {
          month: '08:00',
          city: '21-02-01',
          temperature: 14,
        },
        {
          month: '09:00',
          city: '21-02-02',
          temperature: 18,
        },
        {
          month: '09:00',
          city: '21-02-01',
          temperature: 10,
        },
        {
          month: '10:00',
          city: '21-02-02',
          temperature: 13,
        },
        {
          month: '10:00',
          city: '21-02-01',
          temperature: 6,
        },
        {
          month: '11:00',
          city: '21-02-02',
          temperature: 9,
        },
        {
          month: '11:00',
          city: '21-02-01',
          temperature: 4,
        },
      ],
    };

    return (
      <Card loading={visitsLoading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="访客日增长" key="1">
            <Chart
              scale={{ temperature: { min: 0 } }}
              padding={[10, 20, 50, 40]}
              autoFit
              height={320}
              data={reportsVisitsList && reportsVisitsList.data}
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

export default User;
