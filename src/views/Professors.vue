<template>
  <auth-layout>
    <div class="container mt-2">
      <div class="card">
        <div class="card-body">
          <base-table :items="professors" :keys="['name', 'surname', 'email']">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Professor</base-button>
              </div>
            </template>
            <template #actions="{ item }">
              <div class="btn-group">
                <base-button type="info" @click="editProfessorAction(item)">
                  <font-awesome-icon icon="edit"/>
                </base-button>
                <base-button type="danger" @click="deleteProfessorAction(item.id, item.userId)">
                  <font-awesome-icon icon="trash"/>
                </base-button>
              </div>
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';
import DELETE_PROFESSOR from '../graphql/Professor/DeleteProfessor.gql';

import AuthLayout from '@/layouts/AuthLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'professors',
  data: () => ({
    professors: []
  }),
  components: {
    BaseTable,
    BaseButton,
    AuthLayout
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
        props,
        id: 'professor'
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props,
        id: 'confirmation'
      });
    },
    editProfessorAction(professor) {
      this.openModalAction({ professor });
    },
    deleteProfessorAction(id, userId) {
      this.openConfirmationModal({
        modalTitle: 'Delete professor',
        modalCloseAction: () => this.modalClose('confirmation'),
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
            this.modalClose('confirmation');
          } catch (e) {
            errorHandler(e);
          }
        }
      });
    }
  }
};
</script>
