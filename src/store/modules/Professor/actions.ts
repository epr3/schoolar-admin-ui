import * as constants from './constants';
import { ProfessorState } from '.';
import { ActionTree } from 'vuex';
import { API } from '@/store';

const actions: ActionTree<ProfessorState, {}> = {
  async getProfessors({ commit }, payload: string) {
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
  async updateProfessor({ commit }, payload: { id: string; object: object }) {
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

export default actions;
