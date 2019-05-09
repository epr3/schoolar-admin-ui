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
        <base-button type="primary" @click="postFacultyMethod"
          >Submit</base-button
        >
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
    ...mapActions('Faculty', ['postFaculty']),
    postFacultyMethod() {
      this.$emit('reset:form');
      if (!this.$v.$invalid) {
        this.postFaculty({ name: this.name });
        this.name = '';
      }
    }
  }
};
</script>
