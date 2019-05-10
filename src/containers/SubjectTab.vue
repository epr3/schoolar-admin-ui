<template>
  <base-table :items="subjects">
    <template #filter>
      <div class="col-sm-4">
        <base-button size="lg" type="primary" @click="openModalAction">Add Subject</base-button>
      </div>
      <div class="col-sm-8">Sort + per page</div>
    </template>
    <template #actions="{ item: { id }}">
      <div class="btn-group">
        <base-button type="info" @click="editSubjectAction(id)">Edit</base-button>
        <base-button type="danger" @click="deleteSubjectAction(id)">Delete</base-button>
      </div>
    </template>
  </base-table>
</template>

<script>
import gql from 'graphql-tag';
import { mapMutations } from 'vuex';

import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';
import DELETE_SUBJECT from '../graphql/Subject/DeleteSubject.gql';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'subject-tab',
  data() {
    return {
      subjects: [],
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    subjects: {
      query: gql`
        ${SUBJECTS_QUERY}
      `,
      variables() {
        return {
          facultyId: this.routeParam
        };
      }
    }
  },
  components: {
    BaseTable,
    BaseButton
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/SubjectModal.vue'),
        props
      });
    },

    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    editSubjectAction(id) {
      this.openModalAction({ id });
    },
    deleteSubjectAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete subject',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_SUBJECT,
              variables: {
                id
              },
              update: store => {
                const data = store.readQuery({
                  query: SUBJECTS_QUERY,
                  variables: { facultyId: this.$route.params.id }
                });
                const response = data.subjects.filter(item => item.id !== id);
                store.writeQuery({
                  query: SUBJECTS_QUERY,
                  variables: { facultyId: this.$route.params.id },
                  data: { ...data, subjects: [...response] }
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
