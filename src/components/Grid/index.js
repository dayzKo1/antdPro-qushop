import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './styles.less';

class Grid extends Component {
  render() {
    const { children } = this.props;
    return (
      <Row type="flex" justify="center" className={styles.gridWraper}>
        <Col span={24}>{children}</Col>
      </Row>
    );
  }
}

export default Grid;
