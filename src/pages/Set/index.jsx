import React from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import Grid from '@/components/Grid';
import Safe from './safe';
// import style from "./style.less"

const Set = () => {
  return (
    <Grid>
      <h3 style={{ fontSize: 24 }}>设置</h3>
      <div>
        <Card bodyStyle={{ paddingLeft: 0, height: '100%' }}>
          <Tabs
            tabPosition="left"
            size="large"
            tabBarStyle={{
              // paddingRight:"100px"
              width: '200px',
            }}
          >
            <Tabs.TabPane tab="安全设置" key="1">
              <Safe />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="物流设置" key="2">adf</Tabs.TabPane>
          <Tabs.TabPane tab="支付配置" key="3">adf</Tabs.TabPane> */}
          </Tabs>
          <Row>
            <Col></Col>
          </Row>
        </Card>
      </div>
    </Grid>
  );
};

export default Set;
