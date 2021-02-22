import { productList, productDetail, addProduct, updateProduct } from '@/services/products';
import { batch } from '@/services/api';

export default {
  namespace: 'product',
  state: {
    productsList: {},
    query: {},
    productDetail: {},
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
    *fetchProductDetail({ payload }, { call, put }) {
      const res = yield call(productDetail, payload);
      yield put({ type: 'saveProductDetail', payload: res });
      return res;
    },
    *add({ payload }, { call, put }) {
      const res = yield call(addProduct, payload);
      yield put({ type: 'saveProductDetail', payload: res });
      return res;
    },
    *update({ payload, id }, { call, put }) {
      const res = yield call(updateProduct, payload, id, 'PUT');
      yield put({
        type: 'fetchProductsDetail',
        payload: {
          id: res.ID,
        },
      });
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
    saveProductDetail(state, { payload }) {
      return { ...state, productDetail: payload };
    },
    clearDetail(state) {
      return { ...state, productDetail: {} };
    },
  },
};
