import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, LineAdvance } from 'bizcharts';
// import { Chart, Path } from 'bizcharts';

const { TabPane } = Tabs;

class User extends Component {
  render() {
    const { visitsLoading, reportsVisitsList } = this.props;

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
