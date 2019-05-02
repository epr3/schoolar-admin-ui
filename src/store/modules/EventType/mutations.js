import * as constants from './constants';
import EventType from './model';

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
  [constants.POST_EVENT_TYPE](state, payload) {
    state.loading = false;
    EventType.insert({ data: payload });
  },
  [constants.GET_EVENT_TYPES](state, payload) {
    state.loading = false;
    EventType.create({ data: payload });
  },
  [constants.UPDATE_EVENT_TYPE](state, payload) {
    state.loading = false;
    EventType.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_EVENT_TYPE](state, payload) {
    state.loading = false;
    EventType.delete(payload);
  }
};
