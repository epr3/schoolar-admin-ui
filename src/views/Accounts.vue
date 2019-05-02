<template>
  <guest-layout>
    <div class="container">
      <div class="card">
        <div class="card-body">
          <base-table :items="professors">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Professor</base-button>
              </div>
              <div class="col-sm-8">Sort + per page</div>
            </template>
            <template #actions="{ item: { id }}">
              <div class="btn-group">
                <base-button type="info" @click="editProfessorAction(id)">Edit</base-button>
                <base-button type="danger" @click="deleteProfessorAction(id)">Delete</base-button>
              </div>
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'accounts',
  components: {
    BaseTable,
    BaseButton,
    GuestLayout
  },
  mounted() {
    this.getProfessors();
  },
  computed: {
    ...mapGetters({
      professorQuery: 'entities/professors/all'
    }),
    professors() {
      return this.professorQuery().map(item => item.$toJson());
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions('Professor', ['getProfessors', 'deleteProfessor']),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/ProfessorModal.vue'),
        props
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    editProfessorAction(id) {
      this.openModalAction({ id });
    },
    deleteProfessorAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete professor',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          await this.deleteProfessor(id);
          this.modalClose();
        }
      });
    }
  }
};
</script>
