<template>
  <auth-layout>
    <div class="container mt-2">
      <div class="card">
        <div class="card-body">
          <base-table :items="professorsBySubject" :keys="['name', 'surname']">
            <template #filter>
              <div class="col-sm-4">
                <base-button
                  size="lg"
                  type="primary"
                  @click="openModalAction({ subjectId: $route.params.subjectId})"
                >Add Professor to Subject</base-button>
              </div>
            </template>
            <template #actions="{ item }">
              <div class="btn-group">
                <base-button type="danger" @click="deleteProfessorAction(item.userId)">
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
import gql from 'graphql-tag';

import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import PROFESSORS_QUERY from '../graphql/Professor/ProfessorsBySubject.gql';
import DELETE_PROFESSOR from '../graphql/Professor/DeleteProfessorSubject.gql';

import AuthLayout from '@/layouts/AuthLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'professor-tab',
  data() {
    return {
      professorsBySubject: [],
      routeParam: this.$route.params.subjectId
    };
  },
  components: {
    BaseTable,
    BaseButton,
    AuthLayout
  },
  apollo: {
    professorsBySubject: {
      query: gql`
        ${PROFESSORS_QUERY}
      `,
      variables() {
        return {
          subjectId: this.routeParam
        };
      }
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/ProfessorTabModal.vue'),
        props,
        id: 'professorTab'
      });
    },
    deleteProfessorAction(id) {
      try {
        this.$apollo.mutate({
          mutation: DELETE_PROFESSOR,
          variables: {
            id
          },
          update: store => {
            const data = store.readQuery({
              query: PROFESSORS_QUERY,
              variables: { subjectId: this.routeParam }
            });
            const response = data.professorsBySubject.filter(
              item => item.userId !== id
            );
            store.writeQuery({
              query: PROFESSORS_QUERY,
              data: { ...data, professorsBySubject: [...response] },
              variables: { subjectId: this.routeParam }
            });
          }
        });
      } catch (e) {
        errorHandler(e);
      }
    }
  }
};
</script>
