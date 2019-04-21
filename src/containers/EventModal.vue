<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit event' : 'Add new event'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Room" type="text" :v="$v.room" placeholder="2000" v-model="room"/>
        <base-input label="Interval" type="number" :v="$v.interval" placeholder="1" v-model="interval"/>
        <base-select label="Frequency" :v="$v.frequency" v-model="frequency" :options="[{id: 1, label: Daily, value: 'DAILY'}, {id: 2, label: Weekly, value: 'WEEKLY'}]" />
        <base-checkbox id="notifiable" label="Is Notifiable" :v="$v.isNotifiable" v-model="isNotifiable"/>
        <base-checkbox id="full-day" label="Is Full Day" :v="$v.isFullDay" v-model="isFullDay"/>
        <base-select label="Subject" :v="$v.subjectId" v-model="subjectId" :options="subjectSelect" />
        <base-select label="Professor" :v="$v.professorId" v-model="proffesorId" :options="professorSelect" />
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

import { ISubject } from '../store/modules/Subject/model';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

@Component({
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput,
    BaseCheckbox,
    BaseSelect
  },
  validations: {
    isFullDay: {
      required
    },
    subjectId: {
      required
    }
  }
})
export default class EventModal extends Vue {
  private isFullDay = false;
  private subjectId = null;

  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
  @Prop({ type: String, default: '' }) private id: any;
  @Action('postEvent', { namespace: 'Event' }) private postEvent: any;
  @Action('updateEvent', { namespace: 'Event' }) private updateEvent: any;
  @Action('getSubjects', { namespace: 'Subject' }) private getSubjects: any;
  @Getter('events/all', { namespace: 'entities' }) private eventQuery: any;
  @Getter('faculties/query', { namespace: 'entities' }) private facultyQuery: any;
  @Getter('subjects/all', { namespace: 'entities' }) private subjectQuery: any;

  private mounted() {
    this.getSubjects(this.facultyQuery().first().id);
    if (this.id) {
      const event = this.eventQuery(this.id);
    }
  }

  get subjectSelect() {
    return this.subjectQuery().map((item: Model) => item.$toJson()).map((item: ISubject) => ({
      id: item.id,
      label: item.name,
      value: item.id
    }))
  }

  private modalCloseAction() {
    this.modalClose();
  }

  private submitMethod() {
    if (!this.$v.$invalid) {
      const object = {};
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

