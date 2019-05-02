import * as constants from './constants';
import { API } from '@/store';

export default {
  async getProfessors({ commit }) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getProfessors();
      commit(constants.GET_PROFESSORS, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async postProfessor({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postProfessor(payload);
      commit(constants.POST_PROFESSOR, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async updateProfessor({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.updateProfessor(payload.id, payload.object);
      commit(constants.UPDATE_PROFESSOR, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async deleteProfessor({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      await API.deleteProfessor(payload);
      commit(constants.DELETE_PROFESSOR, payload);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
