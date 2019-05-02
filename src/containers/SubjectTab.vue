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
import { mapActions, mapGetters, mapMutations } from 'vuex';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'subject-tab',
  mounted() {
    this.getSubjects(this.$route.params.id);
  },
  components: {
    BaseTable,
    BaseButton
  },
  computed: {
    ...mapGetters({
      subjectQuery: 'entities/subjects/all'
    }),
    subjects() {
      return this.subjectQuery().map(item => {
        const json = item.$toJson();
        delete json.events;
        return json;
      });
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions('Subject', ['getSubjects', 'deleteSubject']),
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
          await this.deleteSubject(id);
          this.modalClose();
        }
      });
    }
  }
};
</script>
