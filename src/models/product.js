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
    *batchProduct({ operating, ids, status }, { call }) {
      if (operating === 'putOffShelf') {
        const selectedPro = [];
        for (let i = 0; i < ids.length; i += 1) {
          selectedPro.push({
            id: ids[i],
            status: status === 'put' ? 'publish' : 'private',
          });
        }
        console.log(selectedPro);
        const res = yield call(batch, { product_status: selectedPro });
        console.log('---', res);
        // return res;
      }
      if (operating === 'delProducts') {
        const selectedPro = [];
        for (let i = 0; i < ids.length; i += 1) {
          selectedPro.push({ id: ids[i] });
        }
        console.log(selectedPro);
        const res = yield call(batch, { delete_product: selectedPro });
        console.log('---', res);
        // return res;
      }
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
