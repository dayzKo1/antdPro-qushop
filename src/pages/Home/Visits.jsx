import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Chart, Line } from 'bizcharts';
// import { Chart, Path } from 'bizcharts';

const { TabPane } = Tabs;

class User extends Component {
  render() {
    const { visitsLoading, reportsVisitsList } = this.props;
    const newData = [];
    if (reportsVisitsList && reportsVisitsList[0]?.data) {
      const { data, data2 } = reportsVisitsList && reportsVisitsList[0];

      data.map((_, index) => {
        const date = _.datetime.split(' ')[0];
        const time = _.datetime.split(' ')[1];
        data[index].date = date;
        data[index].time = time;
        return data;
      });
      data2.map((_, index) => {
        const date = _.datetime.split(' ')[0];
        const time = _.datetime.split(' ')[1];
        data2[index].date = date;
        data2[index].time = time;
        return data2;
      });
      newData.push(...data, ...data2);
    }

    const scale = {
      temperature: { min: 0 },
      value: {
        tickInterval: 1,
        // tickCount: 5,
      },
    };

    return (
      <Card loading={visitsLoading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="访客日增长" key="1">
            <Chart scale={scale} padding={[10, 20, 50, 40]} autoFit height={320} data={newData}>
              <Line
                shape="smooth"
                position="time*value"
                color={['date', ['#448dd8', '#5a9756']]}
                // color="city"
              />
            </Chart>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default User;
