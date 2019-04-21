import * as constants from './constants';
import { EventState } from '.';
import Event, { IEvent } from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<EventState> = {
  [constants.START_LOADING](state: EventState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: EventState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: EventState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.POST_EVENT](state: EventState, payload: IEvent) {
    state.loading = false;
    Event.insert({ data: payload });
  },
  [constants.GET_EVENTS](state: EventState, payload: IEvent) {
    state.loading = false;
    Event.create({ data: payload });
  },
  [constants.UPDATE_EVENT](state: EventState, payload: IEvent) {
    state.loading = false;
    Event.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_EVENT](state: EventState, payload: string) {
    state.loading = false;
    Event.delete(payload);
  }
};

export default mutations;
