<template>
  <base-modal-content modal-title="Add professor to subject" :modal-close-action="modalCloseAction">
    <template #modal-body>
      <div class="container mt-2">
        <div class="card">
          <div class="card-body">
            <base-table :items="filteredProfessors" :keys="['name', 'surname', 'email']">
              <template #actions="{ item }">
                <div class="btn-group">
                  <base-button type="info" @click="addProfessorAction(item.userId)">
                    <font-awesome-icon icon="plus"/>
                  </base-button>
                </div>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </template>
  </base-modal-content>
</template>

<script>
import gql from 'graphql-tag';
import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import loadingMixin from '../mixins/loadingMixin';

import PROFESSORS_BY_SUBJECT_QUERY from '../graphql/Professor/ProfessorsBySubject.gql';
import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';
import ADD_PROFESSOR from '../graphql/Professor/PostProfessorSubject.gql';

import BaseModalContent from '@/components/BaseModalContent.vue';
import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'professor-tab-modal',
  data: () => ({
    professors: [],
    professorsBySubject: []
  }),
  mixins: [loadingMixin],
  components: {
    BaseTable,
    BaseButton,
    BaseModalContent
  },
  props: {
    subjectId: {
      type: String,
      required: true
    }
  },
  // async mounted() {
  //   const response = await this.$apollo.query({
  //     query: PROFESSORS_BY_SUBJECT_QUERY,
  //     variables: { subjectId: this.subjectId }
  //   });
  //   this.professorsBySubject = response.data.professorsBySubject;
  // },
  apollo: {
    professors: PROFESSORS_QUERY,
    professorsBySubject: {
      query: gql`
        ${PROFESSORS_BY_SUBJECT_QUERY}
      `,
      variables() {
        return {
          subjectId: this.subjectId
        };
      }
    }
  },
  computed: {
    filteredProfessors() {
      return this.professors.filter(
        item =>
          !this.professorsBySubject.some(professor => professor.id === item.id)
      );
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('professorTab');
    },
    async addProfessorAction(userId) {
      try {
        await this.$apollo.mutate({
          mutation: ADD_PROFESSOR,
          variables: {
            subjectProfessor: { userId, subjectId: this.subjectId }
          },
          update: (store, { data: { postSubjectProfessor } }) => {
            const data = store.readQuery({
              query: PROFESSORS_BY_SUBJECT_QUERY,
              variables: { subjectId: this.subjectId }
            });
            data.professorsBySubject.push(postSubjectProfessor);
            store.writeQuery({
              query: PROFESSORS_BY_SUBJECT_QUERY,
              variables: { subjectId: this.subjectId },
              data
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
