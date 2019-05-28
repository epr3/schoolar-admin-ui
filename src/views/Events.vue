<template>
  <auth-layout>
    <div class="container-fluid mt-2">
      <div class="card">
        <div class="card-body">
          <base-button type="primary" @click="openModalAction">
            Add Event
          </base-button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col" v-for="day in days" :key="day">{{ day }}</div>
          </div>
          <div class="row" v-if="eventsComputed">
            <div class="col" v-for="(item, index) in eventsComputed" :key="index">
              <event-card
                v-for="event in item"
                :key="event.id"
                :type="event.type"
                :room="event.room"
                :subject="event.subject"
                :professor="event.professor"
                :group="event.group"
                :start-date="event.startDate"
                :end-date="event.endDate"
                :start-time="event.startTime"
                :end-time="event.endTime"
                :color="event.color"
                @click="editEventAction(event)"
              />
            </div>
          </div>
          <div class="row" v-else>
            <p>No events to show</p>
          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';
import { mapMutations } from 'vuex';

import EVENTS_QUERY from '../graphql/Event/Events.gql';

import { DateTime } from 'luxon';

import BaseButton from '@/components/BaseButton.vue';

import EventCard from '@/components/EventCard.vue';

import AuthLayout from '@/layouts/AuthLayout.vue';

export default {
  name: 'events',
  data() {
    return {
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      events: [],
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    events: {
      query: gql`
        ${EVENTS_QUERY}
      `,
      variables() {
        return {
          groupId: this.routeParam
        };
      }
    }
  },
  components: {
    AuthLayout,
    BaseButton,
    EventCard
  },
  computed: {
    eventsComputed() {
      if (this.events.length === 0) {
        return {};
      }
      return this.days.reduce((acc, val) => {
        acc[val] = this.events
          .filter(
            item => DateTime.fromISO(item.startDate).toFormat('cccc') === val
          )
          .map(item => ({
            id: item.id,
            room: item.room,
            type: item.eventType.type,
            subject: item.subject.name,
            professor: `${item.professor.title} ${item.professor.name} ${
              item.professor.surname
            }`,
            group: item.group.number,
            startDate: DateTime.fromISO(item.startDate).toFormat('dd-LL-yyyy'),
            endDate: DateTime.fromISO(item.endDate).toFormat('dd-LL-yyyy'),
            startTime: DateTime.fromISO(item.startTime).toFormat('HH:mm'),
            endTime: DateTime.fromISO(item.endTime).toFormat('HH:mm'),
            color: item.eventType.color
          }));
        return acc;
      }, {});
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/EventModal.vue'),
        props
      });
    },
    editEventAction(event) {
      this.openModalAction({ event });
    }
  }
};
</script>
