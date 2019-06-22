<template>
  <auth-layout>
    <div class="container mt-2">
      <div class="card">
        <div class="card-body">
          <base-table :items="studentItems">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Student</base-button>
              </div>
              <!-- <div class="col-sm-8">Sort + per page</div> -->
            </template>
            <template #actions="{ item }">
              <div class="btn-group">
                <base-button type="info" @click="editStudentAction(item)">
                  <font-awesome-icon icon="edit"/>
                </base-button>
                <base-button type="danger" @click="deleteStudentAction(item.id, item.userId)">
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

import STUDENTS_QUERY from '../graphql/Student/Students.gql';
import DELETE_STUDENT from '../graphql/Student/DeleteStudent.gql';

import AuthLayout from '@/layouts/AuthLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'students',
  data: () => ({
    students: []
  }),
  components: {
    BaseTable,
    BaseButton,
    AuthLayout
  },
  apollo: {
    students: STUDENTS_QUERY
  },
  computed: {
    studentItems() {
      return this.students.map(item => ({
        id: item.id,
        email: item.email,
        name: item.name,
        surname: item.surname,
        telephone: item.telephone,
        groupId: item.groupId,
        group: item.group.number
      }));
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/StudentModal.vue'),
        props,
        id: 'student'
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props,
        id: 'confirmation'
      });
    },
    editStudentAction(student) {
      this.openModalAction({ student });
    },
    deleteStudentAction(id, userId) {
      this.openConfirmationModal({
        modalTitle: 'Delete student',
        modalCloseAction: () => this.modalClose('confirmation'),
        modalSuccessAction: async () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_STUDENT,
              variables: {
                id,
                userId
              },
              update: store => {
                const data = store.readQuery({ query: STUDENTS_QUERY });
                const response = data.students.filter(item => item.id !== id);
                store.writeQuery({
                  query: STUDENTS_QUERY,
                  data: { ...data, students: [...response] }
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
