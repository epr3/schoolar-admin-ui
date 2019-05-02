import * as constants from './constants';
import Group from './model';

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
  [constants.GET_GROUP_BY_ID](state, payload) {
    state.loading = false;
    Group.insertOrUpdate({ data: payload });
  },
  [constants.POST_GROUP](state, payload) {
    state.loading = false;
    Group.insert({ data: payload });
  },
  [constants.GET_GROUPS](state, payload) {
    state.loading = false;
    Group.create({
      data: payload,
      insertOrUpdate: ['events']
    });
  },
  [constants.UPDATE_GROUP](state, payload) {
    state.loading = false;
    Group.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_GROUP](state, payload) {
    state.loading = false;
    Group.delete(payload);
  }
};
