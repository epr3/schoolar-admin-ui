<template>
  <base-table :items="groups">
    <template #filter>
      <div class="col-sm-4">
        <base-button size="lg" type="primary" @click="openModalAction"
          >Add Group</base-button
        >
      </div>
      <div class="col-sm-8">Sort + per page</div>
    </template>
    <template #actions="{ item: { id }}">
      <div class="btn-group">
        <base-button type="info" @click="editGroupAction(id)">Edit</base-button>
        <base-button type="danger" @click="deleteGroupAction(id)"
          >Delete</base-button
        >
        <base-button :routerPath="`/groups/${id}/events`" type="primary"
          >Events</base-button
        >
        <base-button type="secondary">Students</base-button>
      </div>
    </template>
  </base-table>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'group-tab',
  mounted() {
    this.getGroups(this.$route.params.id);
  },
  components: {
    BaseTable,
    BaseButton
  },
  computed: {
    ...mapGetters({
      groupQuery: 'entities/groups/query'
    }),
    groups() {
      return this.groupQuery()
        .withAll()
        .get()
        .map(item => {
          const json = item.$toJson();
          // delete json.events;
          return json;
        });
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL',
      openModal: 'Modal/OPEN_MODAL'
    }),
    ...mapActions({
      getGroups: 'Group/getGroups',
      deleteGroup: 'Group/deleteGroup'
    }),

    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/GroupModal.vue'),
        props
      });
    },

    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },

    editGroupAction(id) {
      this.openModalAction({ id });
    },

    deleteGroupAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete group',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          await this.deleteGroup(id);
          this.modalClose();
        }
      });
    }
  }
};
</script>
