<template>
  <guest-layout>
    <div class="container">
      <div class="card">
        <div class="card-body">
          <base-table :items="eventTypes">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Event Type</base-button>
              </div>
              <div class="col-sm-8">Sort + per page</div>
            </template>
            <template #actions="{ item: { id }}">
              <div class="btn-group">
                <base-button type="info" @click="editEventTypeAction(id)">Edit</base-button>
                <base-button type="danger" @click="deleteEventTypeAction(id)">Delete</base-button>
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
export default class EventTypes extends Vue {
  @Action('getEventTypes', { namespace: 'EventType' }) private getEventTypes: any;
  @Action('deleteEventType', { namespace: 'EventType' }) private deleteEventType: any;
  @Mutation('OPEN_MODAL', { namespace: 'Modal' }) private openModal: any;
  @Getter('eventTypes/all', { namespace: 'entities' }) private eventTypesQuery: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;

  private openModalAction(props: object) {
    this.openModal({
      component: () => import('@/containers/EventTypeModal.vue'),
      props
    });
  }

  private openConfirmationModal(props: object) {
    this.openModal({
      component: () => import('@/components/ConfirmationModal.vue'),
      props
    });
  }

  private editEventTypeAction(id: string) {
    this.openModalAction({ id });
  }

  private deleteEventTypeAction(id: string) {
    this.openConfirmationModal({
      modalTitle: 'Delete professor',
      modalCloseAction: this.modalClose,
      modalSuccessAction: async () => {
        await this.deleteEventType(id);
        this.modalClose();
      }
    });
  }

  get eventTypes() {
    return this.eventTypesQuery().map((item: Model) => item.$toJson());
  }

  private mounted() {
    this.getEventTypes();
  }
}
</script>

