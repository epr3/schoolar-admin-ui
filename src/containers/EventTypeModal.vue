<template>
  <base-modal-content
    :modal-title="`${eventType ? 'Edit event type' : 'Add new event type'}`"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-body>
      <form>
        <base-input label="Type" type="text" :v="$v.type" placeholder="Seminar" v-model="type"/>
        <base-color-picker label="Color" :v="$v.color" v-model="color"/>
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';
import loadingMixin from '../mixins/loadingMixin';

import POST_EVENT_TYPE from '../graphql/EventType/PostEventType.gql';
import EVENT_TYPES_QUERY from '../graphql/EventType/EventTypes.gql';
import UPDATE_EVENT_TYPE from '../graphql/EventType/UpdateEventType.gql';

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
    if (this.eventType) {
      this.type = this.eventType.type;
      this.color = this.eventType.color;
    }
  },
  props: {
    eventType: {
      type: Object,
      default: null
    }
  },
  mixins: [validationMixin, loadingMixin],
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
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('eventType');
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.eventType) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_EVENT_TYPE,
              variables: {
                eventType: {
                  id: this.eventType.id,
                  type: this.type,
                  color: this.color
                }
              },
              update: (store, { data: { updateEventType } }) => {
                const data = store.readQuery({ query: EVENT_TYPES_QUERY });
                const itemIndex = data.eventTypes.findIndex(
                  item => item.id === updateEventType.id
                );
                store.writeQuery({
                  query: EVENT_TYPES_QUERY,
                  data: {
                    ...data,
                    eventTypes: data.eventTypes.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateEventType };
                    })
                  }
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateEventType: {
                  __typename: 'EventType',
                  color: this.color,
                  type: this.type,
                  id: null
                }
              }
            });
            this.modalCloseAction();
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            await this.$apollo.mutate({
              mutation: POST_EVENT_TYPE,
              variables: {
                eventType: {
                  type: this.type,
                  color: this.color
                }
              },
              update: (store, { data: { postEventType } }) => {
                const data = store.readQuery({ query: EVENT_TYPES_QUERY });
                data.eventTypes.push(postEventType);
                store.writeQuery({ query: EVENT_TYPES_QUERY, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                postEventType: {
                  __typename: 'EventType',
                  color: this.color,
                  type: this.type,
                  id: null
                }
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
  }
};
</script>
