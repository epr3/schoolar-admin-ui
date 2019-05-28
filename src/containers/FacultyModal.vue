<template>
  <base-modal-content
    :modal-title="`${faculty ? 'Edit faculty' : 'Add new faculty'}`"
    :modal-close-action="modalClose"
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
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import errorHandler from '../utils/errorHandler';

import { mapState, mapMutations } from 'vuex';
import POST_FACULTY from '../graphql/Faculty/PostFaculty.gql';
import UPDATE_FACULTY from '../graphql/Faculty/UpdateFaculty.gql';
import FACULTIES_QUERY from '../graphql/Faculty/Faculties.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

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
  mixins: [validationMixin],
  mounted() {
    if (this.faculty) {
      this.name = this.faculty.name;
    }
  },
  validations: {
    name: {
      required
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent'])
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
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
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            this.$apollo.mutate({
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
          } catch (e) {
            errorHandler(e);
          }
        }
        this.modalClose();
        this.name = '';
      }
    }
  }
};
</script>
