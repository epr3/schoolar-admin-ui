import * as constants from './constants';
import Professor from './model';

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
  [constants.POST_PROFESSOR](state, payload) {
    state.loading = false;
    Professor.insert({ data: payload });
  },
  [constants.GET_PROFESSORS](state, payload) {
    state.loading = false;
    Professor.create({ data: payload });
  },
  [constants.UPDATE_PROFESSOR](state, payload) {
    state.loading = false;
    Professor.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_PROFESSOR](state, payload) {
    state.loading = false;
    Professor.delete(payload);
  }
};
