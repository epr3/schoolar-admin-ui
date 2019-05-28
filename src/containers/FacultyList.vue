<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col-sm-8 offset-sm-2">
        <base-button size="lg" type="primary" @click="openModalAction">Add Faculty</base-button>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-sm-8 offset-sm-2">
        <div class="list-group" v-if="faculties.length">
          <li
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            v-for="item in faculties"
            :key="item.id"
          >
            <router-link tag="span" :to="`/faculties/${item.id}`">
              {{ item.name }}
            </router-link>
            <div class="btn-group">
              <base-button type="secondary" @click="editFacultyAction(item)">
                Edit faculty
              </base-button>
              <base-button type="danger" @click="deleteFacultyAction(item.id)">
                Delete faculty
              </base-button>
            </div>
          </li>
        </div>
        <p v-else>No data to show.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import FACULTIES_QUERY from '../graphql/Faculty/Faculties.gql';
import DELETE_FACULTY from '../graphql/Faculty/DeleteFaculty.gql';

import BaseButton from '../components/BaseButton';

export default {
  name: 'faculty-list',
  data: () => ({
    faculties: []
  }),
  components: {
    BaseButton
  },
  apollo: {
    faculties: FACULTIES_QUERY
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/FacultyModal.vue'),
        props
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    editFacultyAction(faculty) {
      this.openModalAction({ faculty });
    },
    deleteFacultyAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete faculty',
        modalCloseAction: this.modalClose,
        modalSuccessAction: () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_FACULTY,
              variables: {
                id
              },
              update: store => {
                const data = store.readQuery({ query: FACULTIES_QUERY });
                const response = data.faculties.filter(item => item.id !== id);
                store.writeQuery({
                  query: FACULTIES_QUERY,
                  data: { ...data, faculties: [...response] }
                });
              }
            });
            this.modalClose();
          } catch (e) {
            errorHandler(e);
          }
        }
      });
    }
  }
};
</script>
