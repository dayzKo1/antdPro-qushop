import { stringify } from 'querystring';
import { history } from 'umi';
import { routerRedux } from 'dva/router';
import { login,logout } from '@/services/login';
import { setAuthority,setToken,setCurrentUser,removeToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      console.log("--fffff",response);
      if (response?.access_token) {
        setToken(response.access_token);
        setCurrentUser(response.user);
        const role = response.user.role ? response.user.role : 'admin';
        setAuthority(role);
        message.success('🎉 🎉 🎉  登录成功！');
        yield put(routerRedux.replace('/'));
      }
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // }); // Login successfully
      // if (response.status === 'ok') {
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params;

      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);

      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);

      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = '/';
      //       return;
      //     }
      //   }

      //   history.replace(redirect || '/');
      // }
    },

    *logout(_, { call, put }) {
      yield call(logout);
      removeToken();
      yield put(
        // routerRedux.replace({
        //   pathname: '/user/login',
        // }),
                history.replace({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
    // logout() {
    //   const { redirect } = getPageQuery(); // Note: There may be security issues, please note

    //   if (window.location.pathname !== '/user/login' && !redirect) {
    //     history.replace({
    //       pathname: '/user/login',
    //       search: stringify({
    //         redirect: window.location.href,
    //       }),
    //     });
    //   }
    // },
  },
  reducers: {
    // changeLoginStatus(state, { payload }) {
    //   return { ...state, status: payload.status, type: payload.type };
    // },
  },
};
export default Model;
