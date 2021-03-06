import { ordersList, batch, ordersDetail, orderStrack } from '@/services/api';

export default {
  namespace: 'orders',
  state: {
    ordersList: {},
    query: {},
    orderDetail: {},
  },

  effects: {
    *fetch({ payload, save }, { call, put }) {
      if (save) {
        yield put({
          type: 'saveQuery',
          payload,
        });
        sessionStorage.setItem('orderQuery', JSON.stringify(payload));
      }
      let res = yield call(ordersList, { 'filter[financial_status]': 'paid', ...payload });
      if (payload && res.meta && payload.page > res.meta.last_page) {
        const newPayload = payload;
        newPayload.page = res.meta.last_page;
        res = yield call(ordersList, payload);
        if (save) {
          yield put({
            type: 'saveQuery',
            payload: newPayload,
          });
          sessionStorage.setItem('orderQuery', JSON.stringify(newPayload));
        }
      }
      yield put({
        type: 'saveOrdersList',
        payload: res,
      });

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
    *fetchOrderDetail({ payload }, { call, put }) {
      const res = yield call(ordersDetail, payload);
      yield put({ type: 'saveOrderDetail', payload: res });
    },
    *updateTrackno({ payload, id }, { call, put }) {
      const res = yield call(orderStrack, payload, id);
      yield put({ type: 'saveOrderDetail', payload: res });
      return res;
    },
  },
  reducers: {
    saveOrdersList(state, { payload }) {
      return { ...state, ordersList: payload };
    },
    saveQuery(state, { payload }) {
      return { ...state, query: payload };
    },
    saveOrderDetail(state, { payload }) {
      return { ...state, orderDetail: payload };
    },
  },
};
