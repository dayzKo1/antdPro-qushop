import React from 'react';
import { Card, Row, Statistic, Divider } from 'antd';
import styles from './styles.less';

function ChartCard(props) {
  const { title, value, today, todayVal, detail } = props;
  return (
    <Card className={styles.divider} style={{ height: '176px' }}>
      <Row gutter={16}>
        <Statistic title={title} value={value} style={{ width: '100%' }} />
        {detail}
        <Divider />
        <span style={{ fontSize: '10px', paddingRight: '10px' }}>{today}</span>
        <span style={{ fontSize: '10px' }}>{todayVal}</span>
      </Row>
    </Card>
  );
}

export default ChartCard;
