import { ordersList } from '@/services/api';

export default {
  namespace: 'orders',
  state: {
    ordersList: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(ordersList, payload);
      yield put({
        type: 'saveOrdersList',
        payload: res,
      });
      return res;
    },
  },
  reducers: {
    saveOrdersList(state, { payload }) {
      return { ...state, ordersList: payload };
    },
  },
};
