<template>
  <guest-layout>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <base-button type="primary" @click="openModalAction">Add Event</base-button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col" v-for="day in days" :key="day">{{ day }}</div>
          </div>
          <div class="row">
            <div class="col" v-for="(item, index) in events" :key="index">
              <event-card
                v-for="event in item"
                :key="event.id"
                :type="event.type"
                :subject="event.subject"
                :professor="event.professor"
                :group="event.group"
                :start-date="event.startDate"
                :end-date="event.endDate"
                :start-time="event.startTime"
                :end-time="event.endTime"
                :color="event.color"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, Getter } from 'vuex-class';
import { Model } from '@vuex-orm/core';

import { DateTime } from 'luxon';

import BaseButton from '@/components/BaseButton.vue';

import EventCard from '@/components/EventCard.vue';

import GuestLayout from '@/layouts/GuestLayout.vue';
import { IEvent } from '../store/modules/Event/model';

@Component({
  components: {
    GuestLayout,
    BaseButton,
    EventCard
  }
})
export default class Events extends Vue {
  private days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  @Mutation('OPEN_MODAL', { namespace: 'Modal' }) private openModal: any;
  @Action('getGroupById', { namespace: 'Group' }) private getGroupById: any;
  @Action('getEvents', { namespace: 'Event' }) private getEvents: any;
  @Getter('events/query', { namespace: 'entities' }) private eventQuery: any;

  private openModalAction(props: object) {
    this.openModal({
      component: () => import('@/containers/EventModal.vue'),
      props
    });
  }
  private mounted() {
    this.getEvents(this.$route.params.id);
  }

  get events() {
    const events = this.eventQuery()
      .withAll()
      .all()
      .map((item: Model) => item.$toJson());
    return this.days.reduce<{ [val: string]: string }>((acc, val: string) => {
      acc[val] = events
        .filter(
          (item: IEvent) =>
            DateTime.fromISO(item.startDate).toFormat('cccc') === val
        )
        .map((item: IEvent) => ({
          type: item.event_type.type,
          subject: item.subject.name,
          professor: `${item.professor.title} ${item.professor.name} ${
            item.professor.surname
          }`,
          group: item.group.number,
          startDate: DateTime.fromISO(item.startDate).toFormat('dd-LL-yyyy'),
          endDate: DateTime.fromISO(item.endDate).toFormat('dd-LL-yyyy'),
          startTime: DateTime.fromISO(item.startTime).toFormat('HH:mm'),
          endTime: DateTime.fromISO(item.endTime).toFormat('HH:mm'),
          color: item.event_type.color
        }));
      return acc;
    }, {});
  }
}
</script>
