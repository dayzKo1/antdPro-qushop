import { routerRedux } from 'dva/router';
import { queryCustomers } from '@/services/api';
import { setAuthority, setToken, setCurrentUser, removeToken } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Customers = {
  namespace: 'customers',
  state: {
    customersData: []
  },

  effects: {
    *queryCustomers({ payload }, { call, put }) {
      const response = yield call(queryCustomers, payload);
      yield put({ type: "save", payload: response })
      return response
    },
  },
  reducers: {
    save(state, { payload }) {
      return {...state,customersData: payload.data,meta: payload.meta}
    }
  },
};
export default Customers;
