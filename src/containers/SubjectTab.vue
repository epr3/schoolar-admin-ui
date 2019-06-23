<template>
  <base-table :items="subjects" :keys="['name']">
    <template #filter>
      <div class="col-sm-4">
        <base-button size="lg" type="primary" @click="openModalAction">Add Subject</base-button>
      </div>
    </template>
    <template #actions="{ item }">
      <div class="btn-group">
        <base-button type="info" @click="editSubjectAction(item)">
          <font-awesome-icon icon="edit"/>
        </base-button>
        <base-button type="danger" @click="deleteSubjectAction(item.id)">
          <font-awesome-icon icon="trash"/>
        </base-button>
        <base-button
          :routerPath="`/faculties/${$route.params.id}/subjects/${item.id}/professors`"
          type="primary"
        >
          <font-awesome-icon icon="user-tie"/>
          <div class="tooltip bs-tooltip-top" role="tooltip">
            <div class="arrow"></div>
            <div class="tooltip-inner">Professors</div>
          </div>
        </base-button>
      </div>
    </template>
  </base-table>
</template>

<style lang="scss" scoped>
.btn:hover {
  .tooltip {
    opacity: 1;
  }
}
.tooltip {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  .arrow {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

<script>
import gql from 'graphql-tag';
import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

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
        props,
        id: 'subject'
      });
    },

    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props,
        id: 'confirmation'
      });
    },
    editSubjectAction(subject) {
      this.openModalAction({ subject });
    },
    deleteSubjectAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete subject',
        modalCloseAction: () => this.modalClose('confirmation'),
        modalSuccessAction: async () => {
          try {
            await this.$apollo.mutate({
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
