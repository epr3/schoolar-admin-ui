<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit event' : 'Add new event'}`"
    :modal-close-action="modalClose"
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
        <div class="form-row">
          <div class="col">
            <base-checkbox
              id="notifiable"
              label="Is Notifiable"
              :v="$v.isNotifiable"
              v-model="isNotifiable"
            />
            <base-checkbox id="full-day" label="Is Full Day" :v="$v.isFullDay" v-model="isFullDay"/>
          </div>
        </div>
        <div class="form-row">
          <div class="col">
            <base-select
              label="Subject"
              :v="$v.subjectId"
              v-model="subjectId"
              :options="subjectSelect"
            />
          </div>
          <div class="col">
            <base-select
              label="Professor"
              :v="$v.professorId"
              v-model="professorId"
              :options="professorSelect"
            />
          </div>
          <div class="col">
            <base-select
              label="Event Type"
              :v="$v.eventTypeId"
              v-model="eventTypeId"
              :options="eventTypeSelect"
            />
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
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import gql from 'graphql-tag';
import { mapState, mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { DateTime } from 'luxon';

import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';
import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';
import EVENT_TYPES_QUERY from '../graphql/EventType/EventTypes.gql';
import EVENTS_QUERY from '../graphql/Event/Events.gql';
import POST_EVENT from '../graphql/Event/PostEvent.gql';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseDateTimePicker from '@/components/BaseDateTimePicker.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  data() {
    return {
      interval: '',
      frequency: null,
      room: '',
      isFullDay: false,
      isNotifiable: false,
      subjectId: null,
      professorId: null,
      eventTypeId: null,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      professors: [],
      subjects: [],
      eventTypes: [],
      facultyId: this.$route.params.facultyId
    };
  },
  async mounted() {
    if (this.id) {
      // const response = await this.$apollo.query({
      //   query: EVENT_QUERY,
      //   variables: { id: this.id }
      // });
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
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    professorSelect() {
      return this.professors.map(item => ({
        id: item.id,
        label: `${item.title} ${item.name} ${item.surname}`,
        value: item.id
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
      return this.eventTypes.map(item => ({
        id: item.id,
        label: item.type,
        value: item.id
      }));
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
      if (!this.$v.$invalid) {
        if (this.id) {
          // this.updateEvent({ id: this.id, object });
        } else {
          try {
            this.$apollo.mutate({
              mutation: POST_EVENT,
              variables: {
                event: {
                  interval: parseInt(this.interval),
                  frequency: this.frequency,
                  room: this.room,
                  isFullDay: this.isFullDay,
                  isNotifiable: this.isNotifiable,
                  subjectId: this.subjectId,
                  professorId: this.professorId,
                  eventTypeId: this.eventTypeId,
                  startDate: DateTime.fromJSDate(this.startDate).toISODate(),
                  endDate: DateTime.fromJSDate(this.endDate).toISODate(),
                  startTime: DateTime.fromJSDate(this.startTime).toISOTime(),
                  endTime: DateTime.fromJSDate(this.endTime).toISOTime(),
                  groupId: this.$route.params.id
                }
              },
              update: (store, { data: { postEvent } }) => {
                const data = store.readQuery({
                  query: EVENTS_QUERY,
                  variables: { groupId: this.$route.params.id }
                });
                data.events.push(postEvent);
                store.writeQuery({
                  query: EVENTS_QUERY,
                  data,
                  variables: { groupId: this.$route.params.id }
                });
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
        this.modalClose();
      }
    }
  },
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput,
    BaseCheckbox,
    BaseSelect,
    BaseDateTimePicker
  },
  validations: {
    interval: {
      required
    },
    frequency: {
      required
    },
    room: {
      required
    },
    isNotifiable: {
      required
    },
    isFullDay: {
      required
    },
    professorId: {
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
