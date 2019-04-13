<template>
  <guest-layout>
    <div class="card card__login">
      <div class="card-body">
        <h5 class="card-title">Login</h5>
        <form>
          <base-input
            label="Email"
            type="email"
            :v="$v.email"
            placeholder="test@test.com"
            v-model="email"
          />
          <base-input label="Password" type="password" :v="$v.password" v-model="password"/>
          <base-button type="primary" @click="loginMethod">Login</base-button>
        </form>
      </div>
    </div>
  </guest-layout>
</template>

<style lang="scss">
.card__login {
  width: 18em;
  margin: 0 auto;
}
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import GuestLayout from '@/layouts/GuestLayout.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
@Component({
  components: {
    BaseInput,
    GuestLayout,
    BaseButton
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
