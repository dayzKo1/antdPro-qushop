import { order, hotProduct, sale, user } from '@/services/api';

export default {
  namespace: 'home',
  state: {
    reportsOrdersList: {},
    hotProductsList: {},
    reportsSalesList: {},
    reportsVisitsList: {},
    query: {},
  },

  effects: {
    *reportsOrdersFetch({ payload }, { call, put }) {
      const res = yield call(order, payload);
      yield put({
        type: 'saveReportsOrdersList',
        payload: res,
      });
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
    *reportsSalesFetch({ payload }, { call, put }) {
      const res = yield call(sale, payload);
      yield put({
        type: 'saveReportsSalesList',
        payload: res,
      });
      return res;
    },
    *reportsVisitsFetch({ payload }, { call, put }) {
      const res = yield call(user, payload);
      yield put({
        type: 'saveReportsVisitsList',
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
    saveReportsSalesList(state, { payload }) {
      return { ...state, reportsSalesList: payload };
    },
    saveReportsVisitsList(state, { payload }) {
      return { ...state, reportsVisitsList: payload };
    },
    saveQuery(state, { payload }) {
      return { ...state, query: payload };
    },
  },
};
