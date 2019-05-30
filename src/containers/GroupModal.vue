<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit group' : 'Add new group'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Number" type="text" :v="$v.number" placeholder="1111" v-model="number"/>
        <base-input label="Year" type="text" :v="$v.year" placeholder="2M" v-model="year"/>
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import POST_GROUP from '../graphql/Group/PostGroup.gql';
import GROUPS_QUERY from '../graphql/Group/Groups.gql';
import GROUP_QUERY from '../graphql/Group/Group.gql';
import UPDATE_GROUP from '../graphql/Group/UpdateGroup.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'group-modal',
  data: () => ({
    number: '',
    year: '',
    facultyId: ''
  }),
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  async mounted() {
    if (this.id) {
      const response = await this.$apollo.query({
        query: GROUP_QUERY,
        variables: { id: this.id }
      });
      this.number = response.data.groupById.number;
      this.year = response.data.groupById.year;
      this.facultyId = response.data.groupById.facultyId;
    }
  },
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput
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
        if (this.id) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_GROUP,
              variables: {
                group: {
                  id: this.id,
                  number: this.number,
                  year: this.year,
                  facultyId: this.facultyId
                }
              },
              update: (store, { data: { updateGroup } }) => {
                const data = store.readQuery({
                  query: GROUPS_QUERY,
                  variables: { facultyId: this.$route.params.id }
                });
                const itemIndex = data.groups.findIndex(
                  item => item.id === updateGroup.id
                );
                store.writeQuery({
                  query: GROUPS_QUERY,
                  variables: { facultyId: this.$route.params.id },
                  data: {
                    ...data,
                    groups: data.groups.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateGroup };
                    })
                  }
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateGroup: {
                  __typename: 'Group',
                  facultyId: this.facultyId,
                  number: this.number,
                  year: this.year,
                  id: null
                }
              }
            });
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            await this.$apollo.mutate({
              mutation: POST_GROUP,
              variables: {
                group: {
                  number: this.number,
                  year: this.year,
                  facultyId: this.$route.params.id
                }
              },
              update: (store, { data: { postGroup } }) => {
                const data = store.readQuery({
                  query: GROUPS_QUERY,
                  variables: { facultyId: this.$route.params.id }
                });
                data.groups.push(postGroup);
                store.writeQuery({
                  query: GROUPS_QUERY,
                  data,
                  variables: { facultyId: this.$route.params.id }
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                postGroup: {
                  __typename: 'Group',
                  facultyId: this.facultyId,
                  number: this.number,
                  year: this.year,
                  id: null
                }
              }
            });
          } catch (e) {
            errorHandler(e);
          }
        }
        this.modalClose();
      }
    }
  },
  validations: {
    number: {
      required
    },
    year: {
      required
    }
  }
};
</script>
