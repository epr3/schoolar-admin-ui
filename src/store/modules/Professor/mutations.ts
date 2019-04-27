import * as constants from './constants';
import { ProfessorState } from '.';
import Professor, { IProfessor } from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ProfessorState> = {
  [constants.START_LOADING](state: ProfessorState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: ProfessorState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: ProfessorState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.POST_PROFESSOR](state: ProfessorState, payload: IProfessor) {
    state.loading = false;
    Professor.insert({ data: payload });
  },
  [constants.GET_PROFESSORS](state: ProfessorState, payload: IProfessor) {
    state.loading = false;
    Professor.create({ data: payload });
  },
  [constants.UPDATE_PROFESSOR](state: ProfessorState, payload: IProfessor) {
    state.loading = false;
    Professor.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_PROFESSOR](state: ProfessorState, payload: string) {
    state.loading = false;
    Professor.delete(payload);
  }
};

export default mutations;
