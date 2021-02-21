import { changePassword } from '@/services/login';
import { settingBase } from '@/services/api';
import currencyFormatter from 'currency-formatter';

const Setting = {
  namespace: 'setting',
  state: {
    settingBase: {},
    symbol: '',
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
  },
  reducers: {
    saveSettingBase(state, { payload }) {
      console.log('sdsd', state);
      const currency = currencyFormatter.findCurrency(payload && payload.woocommerce_currency);
      const symbol = currency ? currency.symbol : '$';
      return { ...state, settingBase: payload, symbol };
    },
  },
};
export default Setting;
