import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, Path } from 'bizcharts';

const { TabPane } = Tabs;

class Sales extends Component {
  render() {
    // 数据源
    const { reportsSalesList = {}, salesLoading } = this.props;
    const { data } = reportsSalesList;

    const scale = {
      value: {
        min: 0,
        // max: 1.5,
      },
      datetime: {
        range: [0.05, 0.95],
      },
    };

    return (
      <Card loading={salesLoading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="销售额日增长" key="1">
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

export default Sales;
