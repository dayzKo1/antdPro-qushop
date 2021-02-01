import { reportsOrders, reportsHotProducts, reportsSales, reportsVisits } from '@/services/api';

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
      const res = yield call(reportsHotProducts, payload);
      yield put({
        type: 'saveHotProductsList',
        payload: res,
      });
      return res;
    },
    *reportsSalesFetch({ payload }, { call, put }) {
      const res = yield call(reportsSales, payload);
      yield put({
        type: 'saveReportsSalesList',
        payload: res,
      });
      return res;
    },
    *reportsVisitsFetch({ payload }, { call, put }) {
      const res = yield call(reportsVisits, payload);
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
