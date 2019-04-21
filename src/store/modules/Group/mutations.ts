import * as constants from './constants';
import { GroupState } from '.';
import Group, { IGroup } from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<GroupState> = {
  [constants.START_LOADING](state: GroupState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: GroupState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: GroupState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.GET_GROUP_BY_ID] (state:  GroupState, payload: IGroup) {
    state.loading = false;
    Group.insertOrUpdate({ data: payload });
  },
  [constants.POST_GROUP](state: GroupState, payload: IGroup) {
    state.loading = false;
    Group.insert({ data: payload });
  },
  [constants.GET_GROUPS](state: GroupState, payload: IGroup) {
    state.loading = false;
    Group.create({ data: payload });
  },
  [constants.UPDATE_GROUP](state: GroupState, payload: IGroup) {
    state.loading = false;
    Group.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_GROUP](state: GroupState, payload: string) {
    state.loading = false;
    Group.delete(payload);
  }
};

export default mutations;
