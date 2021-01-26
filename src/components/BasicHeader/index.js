import React from 'react';
import styles from './styles.less';

function BasicHeader(props) {
  const { title, children } = props;
  return (
    <div className={styles.top}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default BasicHeader;
