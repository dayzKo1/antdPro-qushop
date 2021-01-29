import { categoriesList } from '@/services/api';

export default {
  namespace: 'categories',
  state: {
    categoriesList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(categoriesList, payload);
      yield put({
        type: 'saveCategoriesList',
        payload: res,
      });
      return res;
    },
  },
  reducers: {
    saveCategoriesList(state, { payload }) {
      return { ...state, categoriesList: payload };
    },
  },
};
