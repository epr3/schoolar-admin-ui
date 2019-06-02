<template>
  <auth-layout>
    <div class="container mt-2">
      <div class="card">
        <div class="card-body">
          <base-table :items="holidays">
            <template #filter>
              <div class="col-sm-4">
                <base-button size="lg" type="primary" @click="openModalAction">Add Holiday</base-button>
              </div>
            </template>
            <template #actions="{ item }">
              <div class="btn-group">
                <base-button type="info" @click="editHolidayAction(item)">
                  <font-awesome-icon icon="edit" />
                </base-button>
                <base-button type="danger" @click="deleteHolidayAction(item.id)">
                  <font-awesome-icon icon="trash" />
                </base-button>
              </div>
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import HOLIDAYS_QUERY from '../graphql/Holiday/Holidays.gql';
import DELETE_HOLIDAY from '../graphql/Holiday/DeleteHoliday.gql';

import AuthLayout from '@/layouts/AuthLayout.vue';

import BaseTable from '@/components/BaseTable.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'event-types',
  data: () => ({
    holidays: []
  }),
  components: {
    BaseTable,
    BaseButton,
    AuthLayout
  },
  apollo: {
    holidays: HOLIDAYS_QUERY
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/HolidayModal.vue'),
        props,
        id: 'holiday'
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props,
        id: 'confirmation'
      });
    },
    editHolidayAction(holiday) {
      this.openModalAction({ holiday });
    },
    deleteHolidayAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete holiday',
        modalCloseAction: () => this.modalClose('confirmation'),
        modalSuccessAction: async () => {
          try {
            await this.$apollo.mutate({
              mutation: DELETE_HOLIDAY,
              variables: {
                id
              },
              update: store => {
                const data = store.readQuery({ query: HOLIDAYS_QUERY });
                const response = data.holidays.filter(item => item.id !== id);
                store.writeQuery({
                  query: HOLIDAYS_QUERY,
                  data: { ...data, holidays: [...response] }
                });
              }
            });
            this.modalClose('confirmation');
          } catch (e) {
            errorHandler(e);
          }
        }
      });
    }
  }
};
</script>
