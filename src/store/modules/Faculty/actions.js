import * as constants from './constants';
import { API } from '@/store';

export default {
  async getFacultyById({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getFacultyById(payload);
      commit(constants.GET_FACULTY_BY_ID, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async getFaculties({ commit }) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getFaculties();
      commit(constants.GET_FACULTIES, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async postFaculty({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postFaculty(payload);
      commit(constants.POST_FACULTY, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async updateFaculty({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.updateFaculty(payload.id, payload.object);
      commit(constants.UPDATE_FACULTY, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async deleteFaculty({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      await API.deleteFaculty(payload);
      commit(constants.DELETE_FACULTY, payload);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
