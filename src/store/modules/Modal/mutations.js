import * as constants from './constants';

export default {
  [constants.OPEN_MODAL](state, payload) {
    state.modalComponents.push(payload);
  },
  [constants.CLOSE_MODAL](state, payload) {
    const modalCopy = state.modalComponents.find(item => item.id === payload);
    state.modalComponents = state.modalComponents.filter(
      item => item.id !== modalCopy.id
    );
  }
};
