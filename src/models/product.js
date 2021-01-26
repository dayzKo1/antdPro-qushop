import { productList } from '@/services/products';

export default {
  namespace: 'product',
  state: {
    productsList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(productList, payload);
      yield put({
        type: 'saveProductsList',
        payload: res,
      });
      return res;
    },
  },
  reducers: {
    saveProductsList(state, { payload }) {
      return { ...state, productsList: payload };
    },
  },
};
