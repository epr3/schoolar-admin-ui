import * as constants from './constants';
import Subject from './model';

export default {
  [constants.START_LOADING](state) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state) {
    state.loading = false;
  },
  [constants.SET_ERROR](state, payload) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.POST_SUBJECT](state, payload) {
    state.loading = false;
    Subject.insert({ data: payload });
  },
  [constants.GET_SUBJECTS](state, payload) {
    state.loading = false;
    Subject.create({ data: payload });
  },
  [constants.UPDATE_SUBJECT](state, payload) {
    state.loading = false;
    Subject.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_SUBJECT](state, payload) {
    state.loading = false;
    Subject.delete(payload);
  }
};
