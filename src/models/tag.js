import { tagList } from '@/services/tag';

export default {
  namespace: 'tag',
  state: {
    tagsList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(tagList, payload);
      yield put({
        type: 'saveTagsList',
        payload: res,
      });
      return res;
    },
  },
  reducers: {
    saveTagsList(state, { payload }) {
      return { ...state, tagsList: payload };
    },
  },
};
