<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit event type' : 'Add new event type'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Type" type="text" :v="$v.type" placeholder="Seminar" v-model="type"/>
        <base-color-picker label="Color" :v="$v.color" v-model="color" />
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

import BaseInput from '@/components/BaseInput.vue';
import BaseColorPicker from '@/components/BaseColorPicker.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

@Component({
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseColorPicker,
    BaseButton,
    BaseInput
  },
  validations: {
    type: {
      required
    },
    color: {
      required
    }
  }
})
export default class EventTypeModal extends Vue {
  private type = '';
  private color = '';
  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
  @Prop({ type: String, default: '' }) private id: any;
  @Action('postEventType', { namespace: 'EventType' }) private postEventType: any;
  @Action('updateEventType', { namespace: 'EventType' }) private updateEventType: any;
  @Getter('eventTypes/find', { namespace: 'entities' }) private eventTypeQuery: any;

  private mounted() {
    if (this.id) {
      const eventType = this.eventTypeQuery(this.id);
      this.type = eventType.type;
      this.color = eventType.color;
    }
  }

  private modalCloseAction() {
    this.modalClose();
  }

  private submitMethod() {
    if (!this.$v.$invalid) {
      const object = {
        type: this.type,
        color: this.color
      };
      if (this.id) {
        this.updateEventType({ id: this.id, object });
      } else {
        this.postEventType({ ...object });
      }
      this.modalClose();
    }
  }
}
</script>

