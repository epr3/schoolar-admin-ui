<template>
  <guest-layout>
    <div class="container">
      <div class="card">
        <div class="card-body">
          <base-table :items="eventTypes">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction"
                  >Add Event Type</base-button
                >
              </div>
              <div class="col-sm-8">Sort + per page</div>
            </template>
            <template #actions="{ item: { id }}">
              <div class="btn-group">
                <base-button type="info" @click="editEventTypeAction(id)"
                  >Edit</base-button
                >
                <base-button type="danger" @click="deleteEventTypeAction(id)"
                  >Delete</base-button
                >
              </div>
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'event-types',
  components: {
    BaseTable,
    BaseButton,
    GuestLayout
  },
  mounted() {
    this.getEventTypes();
  },
  computed: {
    ...mapGetters({
      eventTypesQuery: 'entities/event_types/all'
    }),
    eventTypes() {
      return this.eventTypesQuery().map(item => item.$toJson());
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions('EventType', ['getEventTypes', 'deleteEventType']),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/EventTypeModal.vue'),
        props
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    editEventTypeAction(id) {
      this.openModalAction({ id });
    },
    deleteEventTypeAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete professor',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          await this.deleteEventType(id);
          this.modalClose();
        }
      });
    }
  }
};
</script>
