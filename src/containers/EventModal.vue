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
              :options="[{id: 1, label: 'Daily', value: 'DAILY'}, {id: 2, label: 'Weekly', value: 'WEEKLY'}]"
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

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Mutation, Action, Getter } from 'vuex-class';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { Model } from '@vuex-orm/core';
import { DateTime } from 'luxon';

import { ISubject } from '../store/modules/Subject/model';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseDateTimePicker from '@/components/BaseDateTimePicker.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';
import { IProfessor } from '../store/modules/Professor/model';
import { IEventType } from '../store/modules/EventType/model';

@Component({
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
})
export default class EventModal extends Vue {
  private interval = '';
  private frequency = null;
  private room = '';
  private isFullDay = false;
  private isNotifiable = false;
  private subjectId = null;
  private professorId = null;
  private eventTypeId = null;
  private startDate = new Date();
  private endDate = new Date();
  private startTime = new Date();
  private endTime = new Date();

  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
  @Prop({ type: String, default: '' }) private id: any;
  @Action('postEvent', { namespace: 'Event' }) private postEvent: any;
  @Action('updateEvent', { namespace: 'Event' }) private updateEvent: any;
  @Action('getFaculties', { namespace: 'Faculty' }) private getFaculties: any;
  @Action('getSubjects', { namespace: 'Subject' }) private getSubjects: any;
  @Action('getProfessors', { namespace: 'Professor' })
  private getProfessors: any;
  @Action('getEventTypes', { namespace: 'EventType' })
  private getEventTypes: any;
  @Getter('events/all', { namespace: 'entities' }) private eventQuery: any;
  @Getter('faculties/query', { namespace: 'entities' })
  private facultyQuery: any;
  @Getter('subjects/all', { namespace: 'entities' }) private subjectQuery: any;
  @Getter('professors/all', { namespace: 'entities' })
  private professorQuery: any;
  @Getter('event_types/all', { namespace: 'entities' })
  private eventTypeQuery: any;

  private async mounted() {
    await this.getFaculties();
    this.getSubjects(this.facultyQuery().first().id);
    this.getEventTypes();
    this.getProfessors();
    if (this.id) {
      const event = this.eventQuery(this.id);
    }
  }

  get professorSelect() {
    return this.professorQuery()
      .map((item: Model) => item.$toJson())
      .map((item: IProfessor) => ({
        id: item.id,
        label: `${item.title} ${item.name} ${item.surname}`,
        value: item.id
      }));
  }

  get subjectSelect() {
    return this.subjectQuery()
      .map((item: Model) => item.$toJson())
      .map((item: ISubject) => ({
        id: item.id,
        label: item.name,
        value: item.id
      }));
  }

  get eventTypeSelect() {
    return this.eventTypeQuery()
      .map((item: Model) => item.$toJson())
      .map((item: IEventType) => ({
        id: item.id,
        label: item.type,
        value: item.id
      }));
  }

  private modalCloseAction() {
    this.modalClose();
  }

  private submitMethod() {
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
}
</script>

