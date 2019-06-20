<template>
  <base-modal-content
    :modal-title="`${faculty ? 'Edit faculty' : 'Add new faculty'}`"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Name"
          type="text"
          :v="$v.name"
          placeholder="Faculty of Something"
          v-model="name"
        />
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import errorHandler from '../utils/errorHandler';
import loadingMixin from '../mixins/loadingMixin';

import { mapMutations } from 'vuex';
import POST_FACULTY from '../graphql/Faculty/PostFaculty.gql';
import UPDATE_FACULTY from '../graphql/Faculty/UpdateFaculty.gql';
import FACULTIES_QUERY from '../graphql/Faculty/Faculties.gql';

import { validationMixin } from 'vuelidate';
import { required, alpha } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'faculty-modal',
  data: () => ({
    name: ''
  }),
  props: {
    faculty: {
      type: Object,
      default: null
    }
  },
  components: {
    BaseInput,
    BaseButton,
    BaseModalContent
  },
  mixins: [validationMixin, loadingMixin],
  mounted() {
    if (this.faculty) {
      this.name = this.faculty.name;
    }
  },
  validations: {
    name: {
      required,
      alpha
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('faculty');
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.faculty) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_FACULTY,
              variables: {
                faculty: {
                  id: this.faculty.id,
                  name: this.name
                }
              },
              update: (store, { data: { updateFaculty } }) => {
                const data = store.readQuery({ query: FACULTIES_QUERY });
                const itemIndex = data.faculties.findIndex(
                  item => item.id === updateFaculty.id
                );
                store.writeQuery({
                  query: FACULTIES_QUERY,
                  data: {
                    ...data,
                    faculties: data.faculties.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateFaculty };
                    })
                  }
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateFaculty: {
                  __typename: 'Faculty',
                  name: this.name,
                  id: null
                }
              }
            });
            this.modalCloseAction();
            this.name = '';
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            await this.$apollo.mutate({
              mutation: POST_FACULTY,
              variables: {
                faculty: {
                  name: this.name
                }
              },
              update: (store, { data: { postFaculty } }) => {
                const data = store.readQuery({ query: FACULTIES_QUERY });
                data.faculties.push(postFaculty);
                store.writeQuery({ query: FACULTIES_QUERY, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                postFaculty: {
                  __typename: 'Faculty',
                  name: this.name,
                  id: null
                }
              }
            });
            this.modalCloseAction();
            this.name = '';
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
