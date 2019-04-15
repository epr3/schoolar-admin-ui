import * as constants from './constants';
import { GroupState } from '.';
import { ActionTree } from 'vuex';
import { API } from '@/store';

const actions: ActionTree<GroupState, {}> = {
  async getGroups({ commit }, payload: string) {
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
  async updateGroup({ commit }, payload: { id: string; object: object }) {
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

export default actions;
