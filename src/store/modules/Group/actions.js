import * as constants from './constants';
import { API } from '@/store';

export default {
  async getGroupById({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getGroupById(payload);
      commit(constants.GET_GROUP_BY_ID, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async getGroups({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getGroupsByFacultyId(payload);
      commit(constants.GET_GROUPS, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async postGroup({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postGroup(payload);
      commit(constants.POST_GROUP, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async updateGroup({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.updateGroup(payload.id, payload.object);
      commit(constants.UPDATE_GROUP, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async deleteGroup({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      await API.deleteGroup(payload);
      commit(constants.DELETE_GROUP, payload);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
