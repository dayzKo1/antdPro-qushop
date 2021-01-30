import { ordersList } from '@/services/api';

export default {
  namespace: 'orders',
  state: {
    ordersList: {},
    query: {},
  },

  effects: {
    *fetch({ payload, save }, { call, put }) {
      const res = yield call(ordersList, payload);
      yield put({
        type: 'saveOrdersList',
        payload: res,
      });
      if (save) {
        yield put({
          type: 'saveQuery',
          payload,
        });
        sessionStorage.setItem('orderQuery', JSON.stringify(payload));
      }
      return res;
    },
  },
  reducers: {
    saveOrdersList(state, { payload }) {
      return { ...state, ordersList: payload };
    },
    saveQuery(state, { payload }) {
      return { ...state, query: payload };
    },
  },
};
