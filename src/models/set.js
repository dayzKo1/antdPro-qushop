import { changePassword } from '@/services/login';
import { settingBase, queryPayment, updateQueryPayment } from '@/services/api';
import currencyFormatter from 'currency-formatter';

const Setting = {
  namespace: 'setting',
  state: {
    settingBase: {},
    symbol: '',
    savePayment: {},
  },

  effects: {
    *changePassword({ payload }, { call }) {
      const res = yield call(changePassword, payload);
      return res;
    },

    *querySettingBase(_, { call, put }) {
      const res = yield call(settingBase);
      yield put({ type: 'saveSettingBase', payload: res });
      return res;
    },

    *queryPaymentData({ payload }, { call, put }) {
      const res = yield call(queryPayment, payload);
      yield put({ type: 'savePaymentData', payload: res });
    },

    *updateQueryPayment({ payload, id }, { call, put }) {
      yield call(updateQueryPayment, payload, id);
      yield put({
        type: 'queryPaymentData',
      });
    },
  },
  reducers: {
    saveSettingBase(state, { payload }) {
      console.log('sdsd', state);
      const currency = currencyFormatter.findCurrency(payload && payload.woocommerce_currency);
      const symbol = currency ? currency.symbol : '$';
      return { ...state, settingBase: payload, symbol };
    },
    savePaymentData(state, { payload }) {
      return { ...state, savePayment: payload };
    },
  },
};
export default Setting;
