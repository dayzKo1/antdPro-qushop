import { changePassword } from '@/services/login';

const Setting = {
  namespace: 'setting',
  state: {},

  effects: {
    *changePassword({ payload }, { call }) {
      const res = yield call(changePassword, payload);
      return res;
    },
  },
  reducers: {},
};
export default Setting;
