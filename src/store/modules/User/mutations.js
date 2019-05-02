import * as constants from './constants';
import User from './model';

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
  [constants.GET_USER](state, payload) {
    state.loading = false;
    User.create({ data: payload });
  }
};
