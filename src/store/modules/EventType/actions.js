import * as constants from './constants';
import { API } from '@/store';

export default {
  async getEventTypes({ commit }) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getEventTypes();
      commit(constants.GET_EVENT_TYPES, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async postEventType({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postEventType(payload);
      commit(constants.POST_EVENT_TYPE, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async updateEventType({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.updateEventType(payload.id, payload.object);
      commit(constants.UPDATE_EVENT_TYPE, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async deleteEventType({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      await API.deleteEventType(payload);
      commit(constants.DELETE_EVENT_TYPE, payload);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
