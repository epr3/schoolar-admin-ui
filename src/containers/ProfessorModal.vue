<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit professor' : 'Add new professor'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Name" type="text" :v="$v.name" placeholder="John" v-model="name"/>
        <base-input
          label="Surname"
          type="text"
          :v="$v.surname"
          placeholder="Doe"
          v-model="surname"
        />
        <base-input
          label="Email"
          type="text"
          :v="$v.email"
          placeholder="example@ie.ase.ro"
          v-model="email"
        />
        <base-input label="Title" type="text" :v="$v.title" placeholder="Ph.D." v-model="title"/>
        <base-input
          label="Telephone"
          type="text"
          :v="$v.telephone"
          placeholder="+40765444222"
          v-model="telephone"
        />
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

import POST_PROFESSOR from '../graphql/Professor/PostProfessor.gql';
import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';
import PROFESSOR_QUERY from '../graphql/Professor/Professor.gql';
import UPDATE_PROFESSOR from '../graphql/Professor/UpdateProfessor.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';
export default {
  name: 'professor-modal',
  data: () => ({
    name: '',
    surname: '',
    title: '',
    userId: '',
    telephone: '',
    email: ''
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
        query: PROFESSOR_QUERY,
        variables: { id: this.id }
      });
      this.name = response.data.professor.name;
      this.surname = response.data.professor.surname;
      this.email = response.data.professor.email;
      this.title = response.data.professor.title;
      this.telephone = response.data.professor.telephone;
      this.userId = response.data.professor.userId;
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
        if (this.id) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_PROFESSOR,
              variables: {
                professor: {
                  id: this.id,
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  title: this.title,
                  telephone: this.telephone,
                  userId: this.userId
                }
              },
              update: (store, { data: { updateProfessor } }) => {
                const data = store.readQuery({ query: PROFESSORS_QUERY });
                const itemIndex = data.professors.findIndex(
                  item => item.id === updateProfessor.id
                );
                store.writeQuery({
                  query: PROFESSORS_QUERY,
                  data: {
                    ...data,
                    professors: data.professors.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateProfessor };
                    })
                  }
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateProfessor: {
                  __typename: 'Professor',
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  title: this.title,
                  telephone: this.telephone,
                  userId: this.userId,
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
              mutation: POST_PROFESSOR,
              variables: {
                professor: {
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  title: this.title,
                  telephone: this.telephone
                }
              },
              update: (store, { data: { postProfessor } }) => {
                const data = store.readQuery({ query: PROFESSORS_QUERY });
                data.professors.push(postProfessor);
                store.writeQuery({ query: PROFESSORS_QUERY, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                postProfessor: {
                  __typename: 'Professor',
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  title: this.title,
                  telephone: this.telephone,
                  userId: this.userId,
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
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput
  },
  validations: {
    name: {
      required
    },
    surname: {
      required
    },
    email: {
      required
    },
    title: {
      required
    },
    telephone: {
      required
    }
  }
};
</script>
