<template>
  <base-table :items="groups">
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, Mutation } from 'vuex-class';
import { Model } from '@vuex-orm/core';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

@Component({
  components: {
    BaseTable,
    BaseButton,
    ConfirmationModal
  }
})
export default class SubjectTab extends Vue {
  @Action('getSubjects', { namespace: 'Subject' }) private getSubjects: any;
  @Action('deleteSubject', { namespace: 'Subject' }) private deleteSubject: any;
  @Mutation('OPEN_MODAL', { namespace: 'Modal' }) private openModal: any;
  @Getter('subjects/all', { namespace: 'entities' }) private subjectQuery: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;

  private openModalAction(props: object) {
    this.openModal({
      component: () => import('@/containers/SubjectModal.vue'),
      props
    });
  }

  private openConfirmationModal(props: object) {
    this.openModal({
      component: () => import('@/components/ConfirmationModal.vue'),
      props
    });
  }

  private editSubjectAction(id: string) {
    this.openModalAction({ id });
  }

  private deleteSubjectAction(id: string) {
    this.openConfirmationModal({
      modalTitle: 'Delete subject',
      modalCloseAction: this.modalClose,
      modalSuccessAction: async () => {
        await this.deleteSubject(id);
        this.modalClose();
      }
    });
  }

  get groups() {
    return this.subjectQuery().map((item: Model) => {
      const json = item.$toJson();
      delete json.events;
      return json;
    });
  }

  private mounted() {
    this.getSubjects(this.$route.params.id);
  }
}
</script>

