import * as constants from './constants';
import Event from './model';

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
  [constants.POST_EVENT](state, payload) {
    state.loading = false;
    Event.insert({ data: payload });
  },
  [constants.GET_EVENTS](state, payload) {
    state.loading = false;
    Event.create({
      data: payload,
      insertOrUpdate: ['group', 'subject', 'event_type', 'professor']
    });
  },
  [constants.UPDATE_EVENT](state, payload) {
    state.loading = false;
    Event.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_EVENT](state, payload) {
    state.loading = false;
    Event.delete(payload);
  }
};
