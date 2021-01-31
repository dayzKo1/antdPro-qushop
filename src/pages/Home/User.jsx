import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, Path } from 'bizcharts';

const { TabPane } = Tabs;

class User extends Component {
  render() {
    // 数据源
    const { reportsVisitsList, visitsLoading } = this.props;
    const { data } = reportsVisitsList;
    const scale = {
      price: {
        min: 0,
        max: 1.5,
      },
      year: {
        range: [0.05, 0.95],
      },
    };
    return (
      <Card loading={visitsLoading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="访客日增长" key="1">
            <Chart height={200} autoFit data={data} scale={scale}>
              <Path
                animate={{
                  appear: {
                    animation: 'path-in',
                    duration: 1000,
                    easing: 'easeLinear',
                  },
                }}
                shape="smooth"
                position="datetime*value"
              />
            </Chart>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default User;
