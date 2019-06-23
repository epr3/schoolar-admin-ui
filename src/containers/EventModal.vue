<template>
  <base-modal-content
    :modal-title="`${event ? 'Edit event' : 'Add new event'}`"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-body>
      <form>
        <div class="form-row">
          <div class="col">
            <base-input label="Room" type="text" :v="$v.room" placeholder="2000" v-model="room"/>
          </div>
          <div class="col">
            <base-input
              label="Interval"
              type="number"
              :v="$v.interval"
              placeholder="1"
              v-model="interval"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="col">
            <base-select
              label="Frequency"
              :v="$v.frequency"
              v-model="frequency"
              :options="[
                { id: 1, label: 'Daily', value: 'DAILY' },
                { id: 2, label: 'Weekly', value: 'WEEKLY' }
              ]"
            />
          </div>
        </div>
        <div class="form-row d-flex align-items-center">
          <div class="col">
            <base-select
              v-if="subjectSelect.length"
              label="Subject"
              :v="$v.subjectId"
              v-model="subjectId"
              :options="subjectSelect"
            />
            <base-button v-else type="info" @click="openSubjectModalAction">Create subject</base-button>
          </div>
          <div class="col">
            <base-select
              v-if="professorSelect.length"
              label="Professor"
              :v="$v.userId"
              v-model="userId"
              :options="professorSelect"
            />
            <base-button v-else type="info" @click="openProfessorModalAction">Create professor</base-button>
          </div>
          <div class="col">
            <base-select
              v-if="eventTypeSelect.length"
              label="Event Type"
              :v="$v.eventTypeId"
              v-model="eventTypeId"
              :options="eventTypeSelect"
            />
            <base-button v-else type="info" @click="openEventTypeModalAction">Create type</base-button>
          </div>
        </div>
        <div class="form-row">
          <div class="col">
            <base-date-time-picker
              label="Start date"
              :v="$v.startDate"
              v-model="startDate"
              type="date"
              format="DD-MM-YYYY"
            />
          </div>
          <div class="col">
            <base-date-time-picker
              label="End date"
              :v="$v.endDate"
              v-model="endDate"
              type="date"
              format="DD-MM-YYYY"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="col">
            <base-date-time-picker
              label="Start time"
              :v="$v.startTime"
              v-model="startTime"
              type="time"
              format="HH:mm"
            />
          </div>
          <div class="col">
            <base-date-time-picker
              label="End time"
              :v="$v.endTime"
              v-model="endTime"
              type="time"
              format="HH:mm"
            />
          </div>
        </div>
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import gql from 'graphql-tag';
import { mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minValue, integer } from 'vuelidate/lib/validators';
import { DateTime } from 'luxon';

import errorHandler from '../utils/errorHandler';
import loadingMixin from '../mixins/loadingMixin';

import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';
import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';
import EVENT_TYPES_QUERY from '../graphql/EventType/EventTypes.gql';
import EVENTS_QUERY from '../graphql/Event/Events.gql';
import POST_EVENT from '../graphql/Event/PostEvent.gql';
import UPDATE_EVENT from '../graphql/Event/UpdateEvent.gql';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseDateTimePicker from '@/components/BaseDateTimePicker.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  data() {
    return {
      interval: '',
      frequency: null,
      room: '',
      subjectId: null,
      userId: null,
      eventTypeId: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      professors: [],
      subjects: [],
      eventTypes: [],
      facultyId: this.$route.params.id
    };
  },
  mounted() {
    if (this.event) {
      this.interval = this.event.interval;
      this.frequency = this.event.frequency;
      this.room = this.event.room;
      this.subjectId = this.event.subjectId;
      this.userId = this.event.userId;
      this.eventTypeId = this.event.eventTypeId;
      this.startDate = DateTime.fromISO(this.event.startDate).toJSDate();
      this.endDate = DateTime.fromISO(this.event.endDate).toJSDate();
      this.startTime = DateTime.fromISO(this.event.startTime).toJSDate();
      this.endTime = DateTime.fromISO(this.event.endTime).toJSDate();
    }
  },
  apollo: {
    professors: PROFESSORS_QUERY,
    subjects: {
      query: gql`
        ${SUBJECTS_QUERY}
      `,
      variables() {
        return {
          facultyId: this.facultyId
        };
      }
    },
    eventTypes: EVENT_TYPES_QUERY
  },
  props: {
    event: {
      type: Object,
      default: null
    }
  },
  computed: {
    professorSelect() {
      return this.professors.map(item => ({
        id: item.userId,
        label: `${item.title} ${item.name} ${item.surname}`,
        value: item.userId
      }));
    },

    subjectSelect() {
      return this.subjects.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id
      }));
    },

    eventTypeSelect() {
      return this.eventTypes
        .filter(item => item.isTest == 0)
        .map(item => ({
          id: item.id,
          label: item.type,
          value: item.id
        }));
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('event');
    },
    openSubjectModalAction() {
      this.openModal({
        component: () => import('@/containers/SubjectModal.vue'),
        id: 'subject'
      });
    },
    openProfessorModalAction() {
      this.openModal({
        component: () => import('@/containers/ProfessorModal.vue'),
        id: 'professor'
      });
    },
    openEventTypeModalAction() {
      this.openModal({
        component: () => import('@/containers/EventTypeModal.vue'),
        id: 'eventType'
      });
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.event) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_EVENT,
              variables: {
                event: {
                  id: this.event.id,
                  interval: parseInt(this.interval),
                  frequency: this.frequency,
                  room: this.room,
                  subjectId: this.subjectId,
                  userId: this.userId,
                  eventTypeId: this.eventTypeId,
                  startDate: DateTime.fromJSDate(this.startDate).toISODate(),
                  endDate: DateTime.fromJSDate(this.endDate).toISODate(),
                  startTime: DateTime.fromJSDate(this.startTime).toISOTime(),
                  endTime: DateTime.fromJSDate(this.endTime).toISOTime(),
                  groupId: this.$route.params.groupId
                }
              },
              update: (store, { data: { updateEvent } }) => {
                const data = store.readQuery({
                  query: EVENTS_QUERY,
                  variables: { groupId: this.$route.params.groupId }
                });
                const itemIndex = data.events.findIndex(
                  item => item.id === updateEvent.id
                );
                store.writeQuery({
                  query: EVENTS_QUERY,
                  data: {
                    ...data,
                    events: data.events.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateEvent };
                    })
                  },
                  variables: { groupId: this.$route.params.groupId }
                });
              }
            });
            this.modalCloseAction();
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            await this.$apollo.mutate({
              mutation: POST_EVENT,
              variables: {
                event: {
                  interval: parseInt(this.interval),
                  frequency: this.frequency,
                  room: this.room,
                  subjectId: this.subjectId,
                  userId: this.userId,
                  eventTypeId: this.eventTypeId,
                  startDate: DateTime.fromJSDate(this.startDate).toISODate(),
                  endDate: DateTime.fromJSDate(this.endDate).toISODate(),
                  startTime: DateTime.fromJSDate(this.startTime).toISOTime(),
                  endTime: DateTime.fromJSDate(this.endTime).toISOTime(),
                  groupId: this.$route.params.groupId
                }
              },
              update: (store, { data: { postEvent } }) => {
                const data = store.readQuery({
                  query: EVENTS_QUERY,
                  variables: { groupId: this.$route.params.groupId }
                });
                data.events.push(postEvent);
                store.writeQuery({
                  query: EVENTS_QUERY,
                  data,
                  variables: { groupId: this.$route.params.groupId }
                });
              }
            });
            this.modalCloseAction();
          } catch (e) {
            errorHandler(e);
          }
        }
        this.loading = false;
      }
    }
  },
  mixins: [validationMixin, loadingMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseDateTimePicker
  },
  validations: {
    interval: {
      required,
      integer,
      minValue: minValue(0)
    },
    frequency: {
      required
    },
    room: {
      required
    },
    userId: {
      required
    },
    subjectId: {
      required
    },
    startDate: {
      required
    },
    endDate: {
      required
    },
    startTime: {
      required
    },
    endTime: {
      required
    },
    eventTypeId: {
      required
    }
  }
};
</script>
