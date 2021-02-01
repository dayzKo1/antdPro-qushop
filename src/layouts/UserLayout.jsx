import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import { Card, Row, Col,Divider } from 'antd';
import React from 'react';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';
import u8 from '../assets/u8.png';

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <Card
            style={{
              width: '80%',
              margin: '3% auto',
              height: '80%',
              minWidth: '900px',
              boxShadow: '0px 0px 19px #aaa',
            }}
            bodyStyle={{ height: '100%' }}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Col xs={12}>
                <div className={styles.top}>
                  <div className={styles.header}>
                    <Link to="/">
                      <img alt="logo" className={styles.logo} src={logo} />
                      <span className={styles.title}>QuShop</span>
                    </Link>
                  </div>
                  <div className={styles.desc}></div>
                </div>
                {children}
              </Col>
              <Col xs={1} style={{height:"80%"}} >
                <Divider style={{height:"100%",borderLeft: "2px solid rgba(0, 0, 0, 0.06)"}} plain type="vertical" />
              </Col>
              <Col xs={11}>
                <img alt="logo" style={{ width: '100%', height: '100%' }} src={u8} />
              </Col>
            </Row>
          </Card>
        </div>

        {/* <DefaultFooter /> */}
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
