import React from 'react';
import { Link } from 'umi';
import styles from './styles.less';

function BasicHeader(props) {
  const { title, parentUrl, parent, children } = props;
  return (
    <div className={styles.top}>
      <h2>
        {parentUrl && parent && (
          <Link style={{ color: '#00000073' }} to={parentUrl}>
            {parent}
          </Link>
        )}
        {title}
      </h2>
      {children}
    </div>
  );
}

export default BasicHeader;
