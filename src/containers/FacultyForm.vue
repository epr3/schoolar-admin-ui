<template>
  <div class="card card__home">
    <div class="card-body">
      <h5 class="card-title">New Faculty</h5>
      <form>
        <base-input
          label="Name"
          type="text"
          :v="$v.name"
          placeholder="Faculty of Something"
          v-model="name"
        />
        <base-button type="primary" @click="postFacultyMethod">Submit</base-button>
      </form>
    </div>
  </div>
</template>

<script>
import POST_FACULTY from '../graphql/Faculty/PostFaculty.gql';
import FACULTY_QUERY from '../graphql/Faculty/Faculties.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'faculty-form',
  data: () => ({
    name: ''
  }),
  components: {
    BaseInput,
    BaseButton
  },
  mixins: [validationMixin],
  validations: {
    name: {
      required
    }
  },
  methods: {
    postFacultyMethod() {
      this.$emit('reset:form');
      if (!this.$v.$invalid) {
        try {
          this.$apollo.mutate({
            mutation: POST_FACULTY,
            variables: {
              faculty: {
                name: this.name
              }
            },
            update: (store, { data: { postFaculty } }) => {
              const data = store.readQuery({ query: FACULTY_QUERY });
              data.faculties.push(postFaculty);
              store.writeQuery({ query: FACULTY_QUERY, data });
            }
          });
        } catch (e) {
          console.error(e);
        }
        this.name = '';
      }
    }
  }
};
</script>
