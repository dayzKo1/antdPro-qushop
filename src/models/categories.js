import { categoriesList, batchesCategories } from '@/services/api';

export default {
  namespace: 'categories',
  state: {
    categoriesData: [],
    meta: {},
    query: {},
  },
  effects: {
    *queryCategories({ payload }, { call, put }) {
      const response = yield call(categoriesList, payload);
      yield put({ type: 'save', payload: response, query: payload });
      return response;
    },
    *batchDel({ payload, query }, { call, put }) {
      console.log('fffffffffff');
      const batchesIds = [];
      for (let i = 0; i < payload.length; i += 1) {
        batchesIds.push({ id: payload[i] });
      }
      console.log('fffffffffff', batchesIds, payload);
      yield call(batchesCategories, { delete_category: batchesIds });
      yield put({
        type: 'queryCategories',
        payload: query,
      });
    },
  },
  reducers: {
    save(state, { payload, query }) {
      return { ...state, categoriesData: payload.data, query };
    },
  },
};
