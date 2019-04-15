import * as constants from './constants';
import { SubjectState } from '.';
import Subject, { ISubject } from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<SubjectState> = {
  [constants.START_LOADING](state: SubjectState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: SubjectState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: SubjectState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.POST_SUBJECT](state: SubjectState, payload: ISubject) {
    state.loading = false;
    Subject.insert({ data: payload });
  },
  [constants.GET_SUBJECTS](state: SubjectState, payload: ISubject) {
    state.loading = false;
    Subject.create({ data: payload });
  },
  [constants.UPDATE_SUBJECT](state: SubjectState, payload: ISubject) {
    state.loading = false;
    Subject.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_SUBJECT](state: SubjectState, payload: string) {
    state.loading = false;
    Subject.delete(payload);
  }
};

export default mutations;
