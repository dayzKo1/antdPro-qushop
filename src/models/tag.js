import { tagList, addProTags } from '@/services/tag';

export default {
  namespace: 'tag',
  state: {
    tagsList: {},
    proTags: [],
    addTags: [],
    page: 0,
    searchTag: '',
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
    *fetchProTags({ payload }, { call, put, select }) {
      const { tag } = yield select();
      const { searchTag } = tag;
      let { page, proTags } = tag;
      let res;
      if (payload || payload === '' || payload === null) {
        page = 1;
        if (payload === '') {
          res = yield call(tagList, { page, sort: 'name' });
        } else if (payload === null) {
          res = yield call(tagList, { page, sort: 'name', page_size: 10 });
        } else {
          res = yield call(tagList, { page, sort: 'name', 'filter[name]': payload });
        }
        proTags = (res && res.data) || [];
        yield put({ type: 'saveProTags', payload: { proTags, page } });
        yield put({ type: 'saveSearchTag', payload });
      } else {
        page += 1;
        if (searchTag === '') {
          res = yield call(tagList, { page, sort: 'name' });
        } else {
          res = yield call(tagList, { page, sort: 'name', 'filter[name]': searchTag });
        }

        proTags = proTags.concat((res && res.data) || []);
        yield put({ type: 'saveProTags', payload: { proTags, page } });
      }
      return proTags;
    },
    *add({ payload }, { call, put }) {
      const tags = [];
      for (let i = 0; i < payload.length; i += 1) {
        const res = yield call(addProTags, { name: payload[i] });
        tags.push(res);
      }
      yield put({ type: 'saveAddTags', payload: tags.map((item) => item.term_taxonomy_id) });
    },
  },
  reducers: {
    saveTagsList(state, { payload }) {
      return { ...state, tagsList: payload };
    },
    initTags(state) {
      return { ...state, page: 0, searchTag: '', proTags: [] };
    },
    saveProTags(state, { payload }) {
      const { proTags, page } = payload;
      return { ...state, proTags, page };
    },
    saveSearchTag(state, { payload }) {
      return { ...state, searchTag: payload };
    },
    saveAddTags(state, { payload }) {
      return { ...state, addTags: payload };
    },
  },
};
