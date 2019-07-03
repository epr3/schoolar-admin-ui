<template>
  <base-modal-content
    :modal-title="`${student ? 'Edit student' : 'Add new student'}`"
    :modal-close-action="modalCloseAction"
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
          placeholder="example@stud.ase.ro"
          v-model="email"
        />
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
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapMutations } from 'vuex';

import loadingMixin from '../mixins/loadingMixin';
import errorHandler from '../utils/errorHandler';

import POST_STUDENT from '../graphql/Student/PostStudent.gql';
import STUDENTS_QUERY from '../graphql/Student/StudentsByGroup.gql';
import UPDATE_STUDENT from '../graphql/Student/UpdateStudent.gql';

import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';
export default {
  name: 'student-tab-modal',
  data: () => ({
    name: '',
    surname: '',
    groupId: '',
    userId: '',
    telephone: '',
    email: ''
  }),
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  mounted() {
    if (this.student) {
      this.name = this.student.name;
      this.surname = this.student.surname;
      this.email = this.student.email;
      this.groupId = this.student.groupId;
      this.telephone = this.student.telephone;
      this.userId = this.student.userId;
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose('studentTab');
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.student) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_STUDENT,
              variables: {
                student: {
                  id: this.student.id,
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  groupId: this.groupId,
                  telephone: this.telephone,
                  userId: this.userId
                }
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateStudent: {
                  __typename: 'Student',
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  groupId: this.groupId,
                  telephone: this.telephone,
                  userId: this.userId,
                  id: null
                }
              },
              update: (store, { data: { updateStudent } }) => {
                const data = store.readQuery({
                  query: STUDENTS_QUERY,
                  variables: { groupId: this.$route.params.groupId }
                });
                const itemIndex = data.students.findIndex(
                  item => item.id === updateStudent.id
                );
                store.writeQuery({
                  query: STUDENTS_QUERY,
                  variables: { groupId: this.$route.params.groupId },
                  data: {
                    ...data,
                    students: data.students.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateStudent };
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
              mutation: POST_STUDENT,
              variables: {
                student: {
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  groupId: this.$route.params.groupId,
                  telephone: this.telephone
                }
              },
              optimisticResponse: {
                __typename: 'Mutation',
                postStudent: {
                  __typename: 'Student',
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  groupId: this.groupId,
                  telephone: this.telephone,
                  userId: this.userId,
                  id: null
                }
              },
              update: (store, { data: { postStudent } }) => {
                const data = store.readQuery({
                  query: STUDENTS_QUERY,
                  variables: { groupId: this.$route.params.groupId }
                });
                data.students.push(postStudent);
                store.writeQuery({
                  query: STUDENTS_QUERY,
                  data,
                  variables: { groupId: this.$route.params.groupId }
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
    surname: {
      required
    },
    email: {
      required,
      email
    },
    telephone: {
      required
    }
  }
};
</script>
