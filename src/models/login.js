import { routerRedux } from 'dva/router';
import { login, logout } from '@/services/login';
import { setAuthority, setToken, setCurrentUser, removeToken } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {},
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response?.access_token) {
        setToken(response.access_token);
        setCurrentUser(response.user);
        const role = response.user.role ? response.user.role : 'admin';
        setAuthority(role);
        message.success('🎉 🎉 🎉  登录成功！');
        yield put(routerRedux.replace('/home'));
      }
    },

    *logout(_, { call, put }) {
      yield call(logout);
      removeToken();
      yield put(
        routerRedux.replace({
          pathname: '/user/login',
        }),
      );
    },
  },
  reducers: {
    // changeLoginStatus(state, { payload }) {
    //   return { ...state, status: payload.status, type: payload.type };
    // },
  },
};
export default Model;
