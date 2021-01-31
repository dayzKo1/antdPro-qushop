import React from 'react';
import { Card, Row, Statistic, Divider } from 'antd';
import styles from './styles.less';

function ChartCard(props) {
  const { title, value, today, todayVal } = props;
  return (
    <Card className={styles.divider}>
      <Row gutter={16}>
        <Statistic title={title} value={value} />
        <Divider />
        <span>{today}</span>
        <span>{todayVal}</span>
      </Row>
    </Card>
  );
}

export default ChartCard;
