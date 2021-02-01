import { queryCustomers, queryCountries } from '@/services/api';

const Customers = {
  namespace: 'customers',
  state: {
    customersData: [],
    meta: {},
    query: {},
    countryList: [],
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
  },
  reducers: {
    save(state, { payload, query }) {
      return { ...state, customersData: payload.data, meta: payload.meta, query };
    },
    saveCountries(state, { payload }) {
      return { ...state, countryList: payload };
    },
  },
};
export default Customers;
