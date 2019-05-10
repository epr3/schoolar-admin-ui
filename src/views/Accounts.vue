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
            <template #actions="{ item: { id, userId }}">
              <div class="btn-group">
                <base-button type="info" @click="editProfessorAction(id)">Edit</base-button>
                <base-button type="danger" @click="deleteProfessorAction(id, userId)">Delete</base-button>
              </div>
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script>
import { mapMutations } from 'vuex';

import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';
import DELETE_PROFESSOR from '../graphql/Professor/DeleteProfessor.gql';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'accounts',
  data: () => ({
    professors: []
  }),
  components: {
    BaseTable,
    BaseButton,
    GuestLayout
  },
  apollo: {
    professors: PROFESSORS_QUERY
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
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
    deleteProfessorAction(id, userId) {
      this.openConfirmationModal({
        modalTitle: 'Delete professor',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_PROFESSOR,
              variables: {
                id,
                userId
              },
              update: store => {
                const data = store.readQuery({ query: PROFESSORS_QUERY });
                const response = data.professors.filter(item => item.id !== id);
                store.writeQuery({
                  query: PROFESSORS_QUERY,
                  data: { ...data, professors: [...response] }
                });
              }
            });
            this.modalClose();
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }
};
</script>
