import mutations from './mutations';
export interface ModalState {
  modalOpen: boolean;
  modalComponent: object | null;
  modalProps: object | null;
}

const state = {
  modalComponent: null,
  modalOpen: false,
  modalProps: null
};

export default {
  namespaced: true,
  state,
  mutations
};
