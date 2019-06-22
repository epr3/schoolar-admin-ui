<template>
  <base-modal-content
    :modal-title="`${subject ? 'Edit subject' : 'Add new subject'}`"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-body>
      <form>
        <base-input label="Name" type="text" :v="$v.name" placeholder="Something" v-model="name"/>
        <base-input
          label="Credits"
          type="number"
          :v="$v.credits"
          placeholder="1"
          v-model="credits"
        />
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapMutations } from 'vuex';

import loadingMixin from '../mixins/loadingMixin';
import errorHandler from '../utils/errorHandler';

import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';
import POST_SUBJECT from '../graphql/Subject/PostSubject.gql';
import UPDATE_SUBJECT from '../graphql/Subject/UpdateSubject.gql';

import { validationMixin } from 'vuelidate';
import { required, integer, minValue } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'subject-modal',
  data: () => ({
    name: '',
    credits: 0,
    facultyId: ''
  }),
  props: {
    subject: {
      subject: Object,
      default: null
    }
  },
  mounted() {
    if (this.subject) {
      this.name = this.subject.name;
      this.credits = this.subject.credits;
      this.facultyId = this.subject.facultyId;
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('subject');
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.subject) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_SUBJECT,
              variables: {
                subject: {
                  id: this.subject.id,
                  name: this.name,
                  credits: parseInt(this.credits),
                  facultyId: this.facultyId
                }
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateSubject: {
                  __typename: 'Subject',
                  name: this.name,
                  credits: parseInt(this.credits),
                  facultyId: this.facultyId,
                  id: null
                }
              },
              update: (store, { data: { updateSubject } }) => {
                const data = store.readQuery({
                  query: SUBJECTS_QUERY,
                  variables: { facultyId: this.$route.params.id }
                });
                const itemIndex = data.subjects.findIndex(
                  item => item.id === updateSubject.id
                );
                store.writeQuery({
                  query: SUBJECTS_QUERY,
                  variables: { facultyId: this.$route.params.id },
                  data: {
                    ...data,
                    subjects: data.subjects.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateSubject };
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
              mutation: POST_SUBJECT,
              variables: {
                subject: {
                  name: this.name,
                  credits: parseInt(this.credits),
                  facultyId: this.$route.params.id
                }
              },
              optimisticResponse: {
                __typename: 'Mutation',
                postSubject: {
                  __typename: 'Subject',
                  name: this.name,
                  credits: parseInt(this.credits),
                  facultyId: this.facultyId,
                  id: null
                }
              },
              update: (store, { data: { postSubject } }) => {
                const data = store.readQuery({
                  query: SUBJECTS_QUERY,
                  variables: { facultyId: this.$route.params.id }
                });
                data.subjects.push(postSubject);
                store.writeQuery({
                  query: SUBJECTS_QUERY,
                  data,
                  variables: { facultyId: this.$route.params.id }
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
    BaseInput
  },
  validations: {
    name: {
      required
    },
    credits: {
      required,
      integer,
      minValue: minValue(0)
    }
  }
};
</script>
