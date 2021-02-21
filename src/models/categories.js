import {
  categoriesList,
  batchesCategories,
  queryCateDetail,
  addCategory,
  updateCategory,
  delCategory,
} from '@/services/api';

export default {
  namespace: 'categories',
  state: {
    categoriesData: [],
    categoryList: [],
    meta: {},
    query: {},
  },
  effects: {
    *queryCategories({ payload }, { call, put }) {
      const response = yield call(categoriesList, payload);
      yield put({ type: 'save', payload: response, query: payload });
      return response;
    },
    *fetchList({ payload }, { call, put }) {
      let res;
      if (payload) {
        res = yield call(categoriesList, payload);
      } else {
        res = yield call(categoriesList, { sort: 'name' });
      }
      yield put({ type: 'saveList', payload: res.data, query: payload });
      return res;
    },
    *batchDel({ payload, query }, { call, put }) {
      const batchesIds = [];
      for (let i = 0; i < payload.length; i += 1) {
        batchesIds.push({ id: payload[i] });
      }
      yield call(batchesCategories, { delete_category: batchesIds });
      yield put({
        type: 'queryCategories',
        payload: query,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const res = yield call(queryCateDetail, payload);
      yield put({ type: 'saveDetail', payload: res });
      return res;
    },
    *add({ payload }, { call }) {
      yield call(addCategory, payload);
    },
    *update({ payload, id }, { call }) {
      yield call(updateCategory, payload, id);
    },
    *del({ payload }, { call }) {
      yield call(delCategory, payload);
    },
  },
  reducers: {
    save(state, { payload, query }) {
      return { ...state, categoriesData: payload.data, query };
    },
    saveList(state, { payload, query }) {
      return { ...state, categoryList: payload || [], query };
    },
    saveDetail(state, { payload }) {
      return { ...state, cateDetail: payload };
    },
    clearDetail(state) {
      return { ...state, cateDetail: {} };
    },
  },
};
