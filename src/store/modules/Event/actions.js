import * as constants from './constants';
import { API } from '@/store';

export default {
  async getEvents({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getEventsByGroupId(payload);
      commit(constants.GET_EVENTS, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async postEvent({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postEvent(payload);
      commit(constants.POST_EVENT, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async updateEvent({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.updateEvent(payload.id, payload.object);
      commit(constants.UPDATE_EVENT, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async deleteEvent({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      await API.deleteEvent(payload);
      commit(constants.DELETE_EVENT, payload);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
