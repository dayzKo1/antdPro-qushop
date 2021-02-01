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
      if (save) {
        yield put({
          type: 'saveQuery',
          payload,
        });
        sessionStorage.setItem('proQuery', JSON.stringify(payload));
      }
      let res = yield call(productList, payload);
      if (payload && res.meta && payload.page > res.meta.last_page) {
        const newPayload = payload;
        newPayload.page = res.meta.last_page;
        res = yield call(productList, payload);
        if (save) {
          yield put({
            type: 'saveQuery',
            payload: newPayload,
          });
          sessionStorage.setItem('proQuery', JSON.stringify(newPayload));
        }
      }
      yield put({
        type: 'saveProductsList',
        payload: res,
      });
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
        yield call(batch, { product_status: selectedPro });
      }
      if (operating === 'delProducts') {
        const selectedPro = [];
        for (let i = 0; i < ids.length; i += 1) {
          selectedPro.push({ id: ids[i] });
        }
        yield call(batch, { delete_product: selectedPro });
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
