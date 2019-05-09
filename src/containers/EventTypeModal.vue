<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit event type' : 'Add new event type'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Type"
          type="text"
          :v="$v.type"
          placeholder="Seminar"
          v-model="type"
        />
        <base-color-picker label="Color" :v="$v.color" v-model="color" />
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

import BaseInput from '@/components/BaseInput.vue';
import BaseColorPicker from '@/components/BaseColorPicker.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'event-type-modal',
  data: () => ({
    type: '',
    color: ''
  }),
  mounted() {
    if (this.id) {
      const eventType = this.eventTypeQuery(this.id);
      this.type = eventType.type;
      this.color = eventType.color;
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
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
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    ...mapGetters({
      eventTypeQuery: 'entities/event_types/find'
    })
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions({
      postEventType: 'EventType/postEventType',
      updateEventType: 'EventType/updateEventType'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
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
};
</script>
