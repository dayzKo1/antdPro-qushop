import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, LineAdvance } from 'bizcharts';

const { TabPane } = Tabs;

class Sales extends Component {
  render() {
    const { reportsSalesList, salesLoading } = this.props;
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
