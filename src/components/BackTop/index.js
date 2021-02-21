import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import { Icon } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

function BackTop(props) {
  const { title } = props;

  function clickRow() {
    const { href, backTip, state } = props;
    if (backTip) {
      backTip();
      return;
    }
    props.dispatch(routerRedux.push({ pathname: href, state }));
  }

  return (
    <a
      onClick={clickRow}
      style={{
        display: 'inline-block',
        marginBottom: 10,
        fontSize: 14,
        color: '#5e7185',
      }}
    >
      {/* <Icon type="left" /> */}
      <LeftOutlined />
      {title}
    </a>
  );
}

export default connect()(BackTop);
