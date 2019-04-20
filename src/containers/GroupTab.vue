<template>
  <base-table :items="groups">
    <template #filter>
      <div class="col-sm-4">
        <base-button size="lg" type="primary" @click="openModalAction">Add Group</base-button>
      </div>
      <div class="col-sm-8">Sort + per page</div>
    </template>
    <template #actions="{ item: { id }}">
      <div class="btn-group">
        <base-button type="info" @click="editGroupAction(id)">Edit</base-button>
        <base-button type="danger" @click="deleteGroupAction(id)">Delete</base-button>
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
export default class GroupTab extends Vue {
  @Action('getGroups', { namespace: 'Group' }) private getGroups: any;
  @Action('deleteGroup', { namespace: 'Group' }) private deleteGroup: any;
  @Mutation('OPEN_MODAL', { namespace: 'Modal' }) private openModal: any;
  @Getter('groups/query', { namespace: 'entities' }) private groupQuery: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;

  private openModalAction(props: object) {
    this.openModal({
      component: () => import('@/containers/GroupModal.vue'),
      props
    });
  }

  private openConfirmationModal(props: object) {
    this.openModal({
      component: () => import('@/components/ConfirmationModal.vue'),
      props
    });
  }

  private editGroupAction(id: string) {
    this.openModalAction({ id });
  }

  private deleteGroupAction(id: string) {
    this.openConfirmationModal({
      modalTitle: 'Delete group',
      modalCloseAction: this.modalClose,
      modalSuccessAction: async () => {
        await this.deleteGroup(id);
        this.modalClose();
      }
    });
  }

  get groups() {
    return this.groupQuery()
      .all()
      .map((item: Model) => item.$toJson());
  }

  private mounted() {
    this.getGroups(this.$route.params.id);
  }
}
</script>

