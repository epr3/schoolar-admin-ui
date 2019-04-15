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

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

@Component({
  components: {
    BaseInput,
    BaseButton
  },
  mixins: [validationMixin],
  validations: {
    name: {
      required
    }
  }
})
export default class CreateFacultyForm extends Vue {
  private name = '';
  @Action('postFaculty', { namespace: 'Faculty' }) private postFaculty: any;

  @Emit('reset:form')
  private postFacultyMethod() {
    if (!this.$v.$invalid) {
      this.postFaculty({ name: this.name });
      this.name = '';
    }
  }
}
</script>