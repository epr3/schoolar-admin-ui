import mutations from './mutations';
import actions from './actions';
export interface EventState {
  loading: boolean;
  error: string;
}

const state = {
  error: '',
  loading: false
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
