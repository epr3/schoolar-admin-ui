<template>
  <base-modal-content
    :modal-title="`${holiday ? 'Edit holiday' : 'Add new holiday'}`"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Name"
          type="text"
          :v="$v.name"
          placeholder="Some holiday"
          v-model="name"
        />
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
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { DateTime } from 'luxon';

import loadingMixin from '../mixins/loadingMixin';
import errorHandler from '../utils/errorHandler';

import HOLIDAYS_QUERY from '../graphql/Holiday/Holidays.gql';
import POST_HOLIDAY from '../graphql/Holiday/PostHoliday.gql';
import UPDATE_HOLIDAY from '../graphql/Holiday/UpdateHoliday.gql';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseDateTimePicker from '@/components/BaseDateTimePicker.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  data() {
    return {
      name: '',
      startDate: null,
      endDate: null
    };
  },
  mounted() {
    if (this.holiday) {
      this.name = this.holiday.name;
      this.startDate = DateTime.fromISO(this.holiday.startDate).toJSDate();
      this.endDate = DateTime.fromISO(this.holiday.endDate).toJSDate();
    }
  },
  props: {
    holiday: {
      type: Object,
      default: null
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('holiday');
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.holiday) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_HOLIDAY,
              variables: {
                holiday: {
                  id: this.holiday.id,
                  name: this.name,
                  startDate: DateTime.fromJSDate(this.startDate).toISODate(),
                  endDate: DateTime.fromJSDate(this.endDate).toISODate()
                }
              },
              update: (store, { data: { updateHoliday } }) => {
                const data = store.readQuery({
                  query: HOLIDAYS_QUERY
                });
                const itemIndex = data.holidays.findIndex(
                  item => item.id === updateHoliday.id
                );
                store.writeQuery({
                  query: HOLIDAYS_QUERY,
                  data: {
                    ...data,
                    holidays: data.holidays.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateHoliday };
                    })
                  }
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
              mutation: POST_HOLIDAY,
              variables: {
                holiday: {
                  name: this.name,
                  startDate: DateTime.fromJSDate(this.startDate).toISODate(),
                  endDate: DateTime.fromJSDate(this.endDate).toISODate()
                }
              },
              update: (store, { data: { postHoliday } }) => {
                const data = store.readQuery({
                  query: HOLIDAYS_QUERY,
                  variables: { groupId: this.$route.params.id }
                });
                data.holidays.push(postHoliday);
                store.writeQuery({
                  query: HOLIDAYS_QUERY,
                  data
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
    BaseDateTimePicker
  },
  validations: {
    name: {
      required
    },
    startDate: {
      required
    },
    endDate: {
      required
    }
  }
};
</script>
