<template>
  <guest-layout>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <base-button type="primary" @click="openModalAction"
            >Add Event</base-button
          >
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col" v-for="day in days" :key="day">{{ day }}</div>
          </div>
          <div class="row" v-if="events">
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

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import { DateTime } from 'luxon';

import BaseButton from '@/components/BaseButton.vue';

import EventCard from '@/components/EventCard.vue';

import GuestLayout from '@/layouts/GuestLayout.vue';

export default {
  name: 'events',
  data: () => ({
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]
  }),
  mounted() {
    this.getEvents(this.$route.params.id);
  },
  components: {
    GuestLayout,
    BaseButton,
    EventCard
  },
  computed: {
    ...mapGetters({
      eventQuery: 'entities/events/query'
    }),
    events() {
      const events = this.eventQuery()
        .withAll()
        .all()
        .map(item => item.$toJson());
      return this.days.reduce((acc, val) => {
        acc[val] = events
          .filter(
            item => DateTime.fromISO(item.startDate).toFormat('cccc') === val
          )
          .map(item => ({
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
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL'
    }),
    ...mapActions({
      getEvents: 'Event/getEvents',
      getGroupById: 'Group/getGroupById'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/EventModal.vue'),
        props
      });
    }
  }
};
</script>
