import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import { history } from 'umi';
import Grid from '@/components/Grid';
import Safe from './safe';
import Payment from './payment';
import Logistics from './logistics';
// import style from "./style.less"

const Set = ({ location: { query } }) => {
  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
    let val = '1';
    switch (query?.type) {
      case 'logistics':
        val = '2';
        break;
      case 'payment':
        val = '3';
        break;
      default:
        history.push('?type=safe');
        break;
    }
    setActiveKey(val);
  }, []);

  const handleTabs = (e) => {
    setActiveKey(e);
    switch (e) {
      case '2':
        history.push('?type=logistics');
        break;
      case '3':
        history.push('?type=payment');
        break;
      default:
        history.push('?type=safe');
        break;
    }
  };

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
            onChange={handleTabs}
            activeKey={activeKey}
          >
            <Tabs.TabPane tab="安全设置" key="1">
              <Safe />
            </Tabs.TabPane>
            <Tabs.TabPane tab="物流设置" key="2">
              <Logistics />
            </Tabs.TabPane>
            <Tabs.TabPane tab="支付配置" key="3">
              <Payment />
            </Tabs.TabPane>
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
