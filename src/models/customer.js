import {
  queryCustomers,
  queryCountries,
  queryCustomerDetail,
  queryCustomerOrders,
  updateDefAddress,
} from '@/services/api';

const Customers = {
  namespace: 'customers',
  state: {
    customersData: [],
    meta: {},
    query: {},
    countryList: [],
    customerDetail: {},
    customerOrders: {},
  },

  effects: {
    *queryCustomers({ payload }, { call, put }) {
      const response = yield call(queryCustomers, payload);
      yield put({ type: 'save', payload: response, query: payload });
      return response;
    },
    *queryCountries(_, { call, put }) {
      const response = yield call(queryCountries);
      yield put({ type: 'saveCountries', payload: response });
      return response;
    },
    *fetchCustomerOrders({ id, payload }, { call, put }) {
      const res = yield call(queryCustomerOrders, id, payload);
      yield put({ type: 'saveCustomerOrders', payload: res });
    },
    *fetchCustomerDetail({ payload }, { call, put }) {
      const res = yield call(queryCustomerDetail, payload);
      yield put({ type: 'saveCustomerDetail', payload: res });
      return res;
    },
    *updateDefAddress({ payload, id }, { call }) {
      yield call(updateDefAddress, payload, id);
    },
  },
  reducers: {
    save(state, { payload, query }) {
      return { ...state, customersData: payload.data, meta: payload.meta, query };
    },
    saveCountries(state, { payload }) {
      return { ...state, countryList: payload };
    },
    saveCustomerDetail(state, { payload }) {
      return { ...state, customerDetail: payload };
    },
    saveCustomerOrders(state, { payload }) {
      return { ...state, customerOrders: payload };
    },
  },
};
export default Customers;
