<template>
  <guest-layout>
    <div class="row d-flex align-items-center">
      <div class="col-sm-6 offset-sm-3">
        <div class="card">
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
      </div>
    </div>
  </guest-layout>
</template>

<script>
import LOGIN from '../graphql/Auth/Login.gql';

import errorHandler from '../utils/errorHandler';

import { onLogin } from '../plugins/vue-apollo.js';
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import GuestLayout from '@/layouts/GuestLayout.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'login',
  data: () => ({
    email: '',
    password: ''
  }),
  components: {
    BaseInput,
    GuestLayout,
    BaseButton
  },
  methods: {
    async loginMethod() {
      if (!this.$v.$invalid) {
        try {
          await this.$apollo.mutate({
            mutation: LOGIN,
            variables: {
              email: this.email,
              password: this.password
            },
            update: (_, { data: { login } }) => {
              onLogin(
                this.$apolloProvider.defaultClient,
                login.accessToken,
                login.refreshToken
              );
              this.$router.replace('/');
            }
          });
        } catch (e) {
          errorHandler(e);
        }
      }
    }
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
};
</script>
