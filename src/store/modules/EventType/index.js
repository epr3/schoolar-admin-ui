import mutations from './mutations';
import actions from './actions';

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
