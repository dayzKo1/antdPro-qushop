import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
// import { stringify } from 'querystring';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    try {
      if (dispatch) {
        dispatch({
          type: 'user/fetchCurrent',
        });
        dispatch({ type: 'setting/querySettingBase' });
      }
    } catch (error) {
      if (error && error.status_code === 401) {
        dispatch(
          routerRedux.replace({
            pathname: '/user/login',
          }),
        );
      }
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const isLogin = localStorage.getItem('token');
    // && currentUser && currentUser.id;
    // const queryString = stringify({
    //   redirect: window.location.href,
    // });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      message.info('身份信息已过期');
      return <Redirect to={`/user/login`} />;
      // return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
