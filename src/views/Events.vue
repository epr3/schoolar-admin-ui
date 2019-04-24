<template>
  <guest-layout>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <base-button type="primary" @click="openModalAction">Add Event</base-button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col">
              <event-card v-for="i in 6" :key="i"/>
            </div>
            <div class="col-md col-sm-12">
              <event-card v-for="i in 6" :key="i"/>
            </div>
            <div class="col-md col-sm-12">
              <event-card v-for="i in 6" :key="i"/>
            </div>
            <div class="col-md col-sm-12">
              <event-card v-for="i in 6" :key="i"/>
            </div>
            <div class="col-md col-sm-12">
              <event-card v-for="i in 6" :key="i"/>
            </div>
            <div class="col-md col-sm-12">
              <event-card v-for="i in 6" :key="i"/>
            </div>
            <div class="col-md col-sm-12">
              <event-card v-for="i in 6" :key="i"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation } from 'vuex-class';

import BaseButton from '@/components/BaseButton.vue';

import EventCard from '@/components/EventCard.vue';

import GuestLayout from '@/layouts/GuestLayout.vue';

@Component({
  components: {
    GuestLayout,
    BaseButton,
    EventCard
  }
})
export default class Events extends Vue {
  @Mutation('OPEN_MODAL', { namespace: 'Modal' }) private openModal: any;
  @Action('getGroupById', { namespace: 'Group' }) private getGroupById: any;
  @Action('getEvents', { namespace: 'Event' }) private getEvents: any;

  private openModalAction(props: object) {
    this.openModal({
      component: () => import('@/containers/EventModal.vue'),
      props
    });
  }
  private mounted() {
    this.getGroupById(this.$route.params.id);
    this.getEvents(this.$route.params.id);
  }
}
</script>
