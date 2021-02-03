import React from 'react';
import { ConfigProvider } from 'antd';
import { Inspector } from 'react-dev-inspector';
import locale from 'antd/lib/locale/zh_CN';

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const Layout = ({ children }) => {
  return (
    <InspectorWrapper>
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </InspectorWrapper>
  );
};

export default Layout;
