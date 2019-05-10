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

<script>
import { mapMutations } from 'vuex';
import EVENT_TYPES_QUERY from '../graphql/EventType/EventTypes.gql';
import DELETE_EVENT_TYPE from '../graphql/EventType/DeleteEventType.gql';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'event-types',
  data: () => ({
    eventTypes: []
  }),
  components: {
    BaseTable,
    BaseButton,
    GuestLayout
  },
  apollo: {
    eventTypes: EVENT_TYPES_QUERY
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
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
        modalSuccessAction: () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_EVENT_TYPE,
              variables: {
                id
              },
              update: store => {
                const data = store.readQuery({ query: EVENT_TYPES_QUERY });
                const response = data.eventTypes.filter(item => item.id !== id);
                store.writeQuery({
                  query: EVENT_TYPES_QUERY,
                  data: { ...data, eventTypes: [...response] }
                });
              }
            });
            this.modalClose();
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }
};
</script>
