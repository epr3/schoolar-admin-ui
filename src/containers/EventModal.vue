<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit event' : 'Add new event'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <div class="form-row">
          <div class="col">
            <base-input
              label="Room"
              type="text"
              :v="$v.room"
              placeholder="2000"
              v-model="room"
            />
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
            <base-checkbox
              id="full-day"
              label="Is Full Day"
              :v="$v.isFullDay"
              v-model="isFullDay"
            />
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
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { DateTime } from 'luxon';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseDateTimePicker from '@/components/BaseDateTimePicker.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  data: () => ({
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
    endTime: new Date()
  }),
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    ...mapGetters({
      eventQuery: 'entities/events/all',
      facultyQuery: 'entities/faculties/query',
      subjectQuery: 'entities/subjects/all',
      professorQuery: 'entities/professors/all',
      eventTypeQuery: 'entities/event_types/all'
    }),
    professorSelect() {
      return this.professorQuery()
        .map(item => item.$toJson())
        .map(item => ({
          id: item.id,
          label: `${item.title} ${item.name} ${item.surname}`,
          value: item.id
        }));
    },

    subjectSelect() {
      return this.subjectQuery()
        .map(item => item.$toJson())
        .map(item => ({
          id: item.id,
          label: item.name,
          value: item.id
        }));
    },

    eventTypeSelect() {
      return this.eventTypeQuery()
        .map(item => item.$toJson())
        .map(item => ({
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
    ...mapActions({
      postEvent: 'Event/postEvent',
      updateEvent: 'Event/updateEvent',
      getFaculties: 'Faculty/getFaculties',
      getSubjects: 'Subject/getSubjects',
      getProfessors: 'Professor/getProfessors',
      getEventTypes: 'EventType/getEventTypes'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
      if (!this.$v.$invalid) {
        const object = {
          interval: parseInt(this.interval, 10),
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
        };

        if (this.id) {
          this.updateEvent({ id: this.id, object });
        } else {
          this.postEvent({ ...object });
        }
        this.modalClose();
      }
    }
  },
  async mounted() {
    await this.getFaculties();
    this.getSubjects(this.facultyQuery().first().id);
    this.getEventTypes();
    this.getProfessors();
    if (this.id) {
      const event = this.eventQuery(this.id);
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
