import * as constants from './constants';
import { SubjectState } from '.';
import { ActionTree } from 'vuex';
import { API } from '@/store';

const actions: ActionTree<SubjectState, {}> = {
  async getSubjects({ commit }, payload: string) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getSubjectsByFacultyId(payload);
      commit(constants.GET_SUBJECTS, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async postSubject({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postSubject(payload);
      commit(constants.POST_SUBJECT, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async updateSubject({ commit }, payload: { id: string; object: object }) {
    commit(constants.START_LOADING);
    try {
      const response = await API.updateSubject(payload.id, payload.object);
      commit(constants.UPDATE_SUBJECT, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async deleteSubject({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      await API.deleteSubject(payload);
      commit(constants.DELETE_SUBJECT, payload);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};

export default actions;
