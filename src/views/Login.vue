<template>
  <div>
    <base-input
      label="Email"
      type="email"
      :v="$v.email"
      placeholder="test@test.com"
      v-model="email"
    />
    <base-input label="Password" type="password" :v="$v.password" v-model="password"/>
    <button @click="loginMethod">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
@Component({
  components: {
    BaseInput
  },
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  }
})
export default class Login extends Vue {
  private email = '';
  private password = '';
  @Action('login', { namespace: 'Auth' }) private login: any;
  private loginMethod() {
    if (!this.$v.$invalid) {
      this.login({ email: this.email, password: this.password });
    }
  }
}
</script>
