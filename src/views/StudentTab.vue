<template>
  <auth-layout>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <base-table :items="students">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Student</base-button>
              </div>
              <!-- <div class="col-sm-8">Sort + per page</div> -->
            </template>
            <template #actions="{ item: { id, userId }}">
              <div class="btn-group">
                <base-button type="info" @click="editStudentAction(id)">
                  <font-awesome-icon icon="edit" />
                </base-button>
                <base-button type="danger" @click="deleteStudentAction(id, userId)">
                  <font-awesome-icon icon="trash" />
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
import gql from 'graphql-tag';
import { mapMutations } from 'vuex';

import STUDENTS_QUERY from '../graphql/Student/Students.gql';
import DELETE_STUDENT from '../graphql/Student/DeleteStudent.gql';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

import AuthLayout from '@/layouts/AuthLayout.vue';

export default {
  name: 'subject-tab',
  data() {
    return {
      students: [],
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    students: {
      query: gql`
        ${STUDENTS_QUERY}
      `,
      variables() {
        return {
          groupId: this.routeParam
        };
      }
    }
  },
  components: {
    BaseTable,
    BaseButton,
    AuthLayout
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/StudentModal.vue'),
        props
      });
    },

    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    editStudentAction(id) {
      this.openModalAction({ id });
    },
    deleteStudentAction(id, userId) {
      this.openConfirmationModal({
        modalTitle: 'Delete student',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_STUDENT,
              variables: {
                id,
                userId
              },
              update: store => {
                const data = store.readQuery({
                  query: STUDENTS_QUERY,
                  variables: { groupId: this.$route.params.id }
                });
                const response = data.students.filter(item => item.id !== id);
                store.writeQuery({
                  query: STUDENTS_QUERY,
                  variables: { groupId: this.$route.params.id },
                  data: { ...data, students: [...response] }
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
