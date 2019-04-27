<template>
  <guest-layout>
    <div class="container">
      <div class="card">
        <div class="card-body">
          <base-table :items="professors">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Professor</base-button>
              </div>
              <div class="col-sm-8">Sort + per page</div>
            </template>
            <template #actions="{ item: { id }}">
              <div class="btn-group">
                <base-button type="info" @click="editProfessorAction(id)">Edit</base-button>
                <base-button type="danger" @click="deleteProfessorAction(id)">Delete</base-button>
              </div>
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, Mutation } from 'vuex-class';
import { Model } from '@vuex-orm/core';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

@Component({
  components: {
    BaseTable,
    BaseButton,
    ConfirmationModal,
    GuestLayout
  }
})
export default class GroupTab extends Vue {
  @Action('getProfessors', { namespace: 'Professor' }) private getProfessors: any;
  @Action('deleteProfessor', { namespace: 'Professor' }) private deleteProfessor: any;
  @Mutation('OPEN_MODAL', { namespace: 'Modal' }) private openModal: any;
  @Getter('professors/all', { namespace: 'entities' }) private professorQuery: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;

  private openModalAction(props: object) {
    this.openModal({
      component: () => import('@/containers/ProfessorModal.vue'),
      props
    });
  }

  private openConfirmationModal(props: object) {
    this.openModal({
      component: () => import('@/components/ConfirmationModal.vue'),
      props
    });
  }

  private editProfessorAction(id: string) {
    this.openModalAction({ id });
  }

  private deleteProfessorAction(id: string) {
    this.openConfirmationModal({
      modalTitle: 'Delete professor',
      modalCloseAction: this.modalClose,
      modalSuccessAction: async () => {
        await this.deleteProfessor(id);
        this.modalClose();
      }
    });
  }

  get professors() {
    return this.professorQuery().map((item: Model) => item.$toJson());
  }

  private mounted() {
    this.getProfessors();
  }
}
</script>

