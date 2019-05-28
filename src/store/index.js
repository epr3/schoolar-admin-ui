import Vue from 'vue';
import Vuex from 'vuex';

import Modal from './modules/Modal';
import Error from './modules/Error';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apolloClient: null
  },
  mutations: {
    SET_APOLLO_CLIENT: (state, payload) => {
      state.apolloClient = payload;
    }
  },
  actions: {},
  modules: {
    Modal,
    Error
  }
});
