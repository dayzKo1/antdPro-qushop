import { productList } from '@/services/products';
import { batch } from '@/services/api';

export default {
  namespace: 'product',
  state: {
    productsList: {},
    query: {},
  },
  effects: {
    *fetch({ payload, save }, { call, put }) {
      const res = yield call(productList, payload);
      yield put({
        type: 'saveProductsList',
        payload: res,
      });
      if (save) {
        yield put({
          type: 'saveQuery',
          payload,
        });
        sessionStorage.setItem('proQuery', JSON.stringify(payload));
      }
      return res;
    },
    *batchProduct({ payload }, { call }) {
      const res = yield call(batch, payload);
      console.log('---', res);
      return res;
    },
  },
  reducers: {
    saveProductsList(state, { payload }) {
      return { ...state, productsList: payload };
    },
    saveQuery(state, { payload }) {
      return { ...state, query: payload };
    },
  },
};
