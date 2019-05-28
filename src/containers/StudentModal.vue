<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit student' : 'Add new student'}`"
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
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import errorHandler from '../utils/errorHandler';

import POST_STUDENT from '../graphql/Student/PostStudent.gql';
import STUDENTS_QUERY from '../graphql/Student/Students.gql';
import STUDENT_QUERY from '../graphql/Student/Student.gql';
import UPDATE_STUDENT from '../graphql/Student/UpdateStudent.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';
export default {
  name: 'student-modal',
  data: () => ({
    name: '',
    surname: '',
    groupId: '',
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
        query: STUDENT_QUERY,
        variables: { id: this.id }
      });
      this.name = response.data.student.name;
      this.surname = response.data.student.surname;
      this.email = response.data.student.email;
      this.groupId = response.data.student.groupId;
      this.telephone = response.data.student.telephone;
      this.userId = response.data.student.userId;
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
    submitMethod() {
      if (!this.$v.$invalid) {
        if (this.id) {
          try {
            this.$apollo.mutate({
              mutation: UPDATE_STUDENT,
              variables: {
                student: {
                  id: this.id,
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  groupId: this.groupId,
                  telephone: this.telephone,
                  userId: this.userId
                }
              },
              update: (store, { data: { updateStudent } }) => {
                const data = store.readQuery({ query: STUDENTS_QUERY });
                const itemIndex = data.students.findIndex(
                  item => item.id === updateStudent.id
                );
                store.writeQuery({
                  query: STUDENTS_QUERY,
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
          } catch (e) {
           errorHandler(e);
          }
        } else {
          try {
            this.$apollo.mutate({
              mutation: POST_STUDENT,
              variables: {
                student: {
                  email: this.email,
                  name: this.name,
                  surname: this.surname,
                  groupId: this.$route.params.id,
                  telephone: this.telephone
                }
              },
              update: (store, { data: { postStudent } }) => {
                const data = store.readQuery({
                  query: STUDENTS_QUERY,
                  variables: { groupId: this.$route.params.id }
                });
                data.students.push(postStudent);
                store.writeQuery({
                  query: STUDENTS_QUERY,
                  data,
                  variables: { groupId: this.$route.params.id }
                });
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
    telephone: {
      required
    }
  }
};
</script>
