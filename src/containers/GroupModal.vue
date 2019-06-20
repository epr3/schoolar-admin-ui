<template>
  <base-modal-content
    :modal-title="`${group ? 'Edit group' : 'Add new group'}`"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-body>
      <form>
        <base-input label="Number" type="text" :v="$v.number" placeholder="1111" v-model="number"/>
        <base-input label="Year" type="text" :v="$v.year" placeholder="2M" v-model="year"/>
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

import POST_GROUP from '../graphql/Group/PostGroup.gql';
import GROUPS_QUERY from '../graphql/Group/GroupsByFacultyId.gql';
import UPDATE_GROUP from '../graphql/Group/UpdateGroup.gql';

import { validationMixin } from 'vuelidate';
import { required, alphaNum } from 'vuelidate/lib/validators';

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
    group: {
      type: Object,
      default: null
    }
  },
  mounted() {
    if (this.group) {
      this.number = this.groupById.number;
      this.year = this.groupById.year;
      this.facultyId = this.groupById.facultyId;
    }
  },
  mixins: [validationMixin, loadingMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('group');
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.group) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_GROUP,
              variables: {
                group: {
                  id: this.group.id,
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
            this.modalCloseAction();
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
            this.modalCloseAction();
          } catch (e) {
            errorHandler(e);
          }
        }
        this.loading = false;
      }
    }
  },
  validations: {
    number: {
      required,
      alphaNum
    },
    year: {
      required,
      alphaNum
    }
  }
};
</script>
