import { MutationTree } from 'vuex';
import * as constants from './constants';
import { ModalState } from '.';

const mutations: MutationTree<ModalState> = {
  [constants.OPEN_MODAL](state: ModalState, payload) {
    state.modalOpen = true;
    state.modalComponent = payload.component;
    state.modalProps = payload.props;
  },
  [constants.CLOSE_MODAL](state: ModalState) {
    state.modalOpen = false;
    state.modalComponent = null;
    state.modalProps = null;
  }
};

export default mutations;
