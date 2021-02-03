import { reportsOrders, hotProduct } from '@/services/api';

export default {
  namespace: 'home',
  state: {
    reportsOrdersList: {},
    hotProductsList: {},
    visitSalesList: {},
    query: {},
  },

  effects: {
    *reportsOrdersFetch({ payload, save }, { call, put }) {
      const res = yield call(reportsOrders, payload);
      yield put({
        type: 'saveReportsOrdersList',
        payload: res,
      });
      if (save) {
        yield put({
          type: 'saveQuery',
          payload,
        });
        sessionStorage.setItem('reportsOrdersQuery', JSON.stringify(payload));
      }
      return res;
    },
    *reportsHotProductsFetch({ payload }, { call, put }) {
      const res = yield call(hotProduct, payload);
      yield put({
        type: 'saveHotProductsList',
        payload: res,
      });
      return res;
    },

    *reportsFetch({ payload }, { call, put }) {
      const res = yield call(reportsOrders, payload);
      yield put({
        type: 'saveReportsList',
        payload: res,
      });
      return res;
    },
  },
  reducers: {
    saveReportsOrdersList(state, { payload }) {
      return { ...state, reportsOrdersList: payload };
    },
    saveHotProductsList(state, { payload }) {
      return { ...state, hotProductsList: payload };
    },
    saveReportsList(state, { payload }) {
      return { ...state, visitSalesList: payload };
    },
  },
};
