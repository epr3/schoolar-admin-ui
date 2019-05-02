import * as constants from './constants';
import Faculty from './model';

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
  [constants.POST_FACULTY](state, payload) {
    state.loading = false;
    Faculty.insert({ data: payload });
  },
  [constants.GET_FACULTIES](state, payload) {
    state.loading = false;
    Faculty.create({ data: payload });
  },
  [constants.GET_FACULTY_BY_ID](state, payload) {
    state.loading = false;
    Faculty.insertOrUpdate({ data: payload });
  },
  [constants.UPDATE_FACULTY](state, payload) {
    state.loading = false;
    Faculty.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_FACULTY](state, payload) {
    state.loading = false;
    Faculty.delete(payload);
  }
};
