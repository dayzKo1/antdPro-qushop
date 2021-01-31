import { ordersList, batch } from '@/services/api';

export default {
  namespace: 'orders',
  state: {
    ordersList: {},
    query: {},
  },

  effects: {
    *fetch({ payload, save }, { call, put }) {
      const res = yield call(ordersList, payload);
      yield put({
        type: 'saveOrdersList',
        payload: res,
      });
      if (save) {
        yield put({
          type: 'saveQuery',
          payload,
        });
        sessionStorage.setItem('orderQuery', JSON.stringify(payload));
      }
      return res;
    },
    *batchOrder({ operating, ids, status }, { call }) {
      if (operating === 'mark') {
        const selectedId = [];
        for (let i = 0; i < ids.length; i += 1) {
          selectedId.push({
            id: ids[i],
            status: status === 'complete' ? 'wc-completed' : 'wc-processing',
          });
        }
        console.log('标记已完成', selectedId);
        yield call(batch, { order_status: selectedId });
      }
      if (operating === 'fulfilled') {
        const selectedId = [];
        for (let i = 0; i < ids.length; i += 1) {
          selectedId.push({
            id: ids[i],
            trackNo: '',
            sendEmail: true,
          });
        }
        console.log('fulfilled', selectedId);
        yield call(batch, { order_shipping: selectedId });
      }
    },
  },
  reducers: {
    saveOrdersList(state, { payload }) {
      return { ...state, ordersList: payload };
    },
    saveQuery(state, { payload }) {
      return { ...state, query: payload };
    },
  },
};
