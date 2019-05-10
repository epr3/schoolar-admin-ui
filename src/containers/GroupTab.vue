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
        <base-button :routerPath="`/groups/${id}/events`" type="primary">Events</base-button>
        <base-button type="secondary">Students</base-button>
      </div>
    </template>
  </base-table>
</template>

<script>
import gql from 'graphql-tag';

import { mapMutations } from 'vuex';

import GROUPS_QUERY from '../graphql/Group/Groups.gql';
import DELETE_GROUP from '../graphql/Group/DeleteGroup.gql';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'group-tab',
  data() {
    return {
      groups: [],
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    groups: {
      query: gql`
        ${GROUPS_QUERY}
      `,
      variables() {
        return {
          facultyId: this.routeParam
        };
      }
    }
  },
  components: {
    BaseTable,
    BaseButton
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL',
      openModal: 'Modal/OPEN_MODAL'
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
          try {
            this.$apollo.mutate({
              mutation: DELETE_GROUP,
              variables: {
                id
              },
              update: store => {
                const data = store.readQuery({
                  query: GROUPS_QUERY,
                  variables: { facultyId: this.$route.params.id }
                });
                const response = data.groups.filter(item => item.id !== id);
                store.writeQuery({
                  query: GROUPS_QUERY,
                  variables: { facultyId: this.$route.params.id },
                  data: { ...data, groups: [...response] }
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
