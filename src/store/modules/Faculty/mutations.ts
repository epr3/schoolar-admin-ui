import * as constants from './constants';
import { FacultyState } from '.';
import Faculty, { IFaculty } from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<FacultyState> = {
  [constants.START_LOADING](state: FacultyState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: FacultyState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: FacultyState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.POST_FACULTY](state: FacultyState, payload: IFaculty) {
    state.loading = false;
    Faculty.insert({ data: payload });
  },
  [constants.GET_FACULTIES](state: FacultyState, payload: IFaculty) {
    state.loading = false;
    Faculty.create({ data: payload });
  },
  [constants.GET_FACULTY_BY_ID](state: FacultyState, payload: IFaculty) {
    state.loading = false;
    Faculty.insertOrUpdate({ data: payload });
  },
  [constants.UPDATE_FACULTY](state: FacultyState, payload: IFaculty) {
    state.loading = false;
    Faculty.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_FACULTY](state: FacultyState, payload: string) {
    state.loading = false;
    Faculty.delete(payload);
  }
};

export default mutations;
