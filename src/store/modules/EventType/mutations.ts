import * as constants from './constants';
import { EventTypeState } from '.';
import EventType, { IEventType } from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<EventTypeState> = {
  [constants.START_LOADING](state: EventTypeState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: EventTypeState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: EventTypeState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.POST_EVENT_TYPE](state: EventTypeState, payload: IEventType) {
    state.loading = false;
    EventType.insert({ data: payload });
  },
  [constants.GET_EVENT_TYPES](state: EventTypeState, payload: IEventType) {
    state.loading = false;
    EventType.create({ data: payload });
  },
  [constants.UPDATE_EVENT_TYPE](state: EventTypeState, payload: IEventType) {
    state.loading = false;
    EventType.update({ where: payload.id, data: payload });
  },
  [constants.DELETE_EVENT_TYPE](state: EventTypeState, payload: string) {
    state.loading = false;
    EventType.delete(payload);
  }
};

export default mutations;
