<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <router-link class="navbar-brand" to="/" exact>Schoolar Admin</router-link>
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="toggleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: showNavbar }">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact>
              Home
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/professors" exact>
              Professors
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/students" exact>
              Students
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/event_types" exact>
              Event Types
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/holidays" exact>
              Holidays
            </router-link>
          </li>
        </ul>
        <div class="nav-item">
          <base-button type="primary" @click="logout">Log out</base-button>
        </div>
      </div>
    </nav>
    <div class="alert-list" v-if="errors.length">
      <base-alert
        v-for="(error, index) in errors"
        :key="index"
        :message="error"
        type="danger"
      />
    </div>
    <slot></slot>
    <modal-container />
  </div>
</template>

<style lang="scss" scoped>
.alert-list {
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 9999;
}
</style>

<script>
import { mapState } from 'vuex';
import { onLogout } from '../plugins/vue-apollo';

import BaseAlert from '../components/BaseAlert';
import BaseButton from '../components/BaseButton';
import ModalContainer from '@/containers/ModalContainer.vue';

export default {
  name: 'auth-layout',
  data: () => ({
    showNavbar: false
  }),
  computed: {
    ...mapState('Error', ['errors'])
  },
  components: {
    BaseAlert,
    BaseButton,
    ModalContainer
  },
  methods: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    async logout() {
      await onLogout(this.$apolloProvider.defaultClient);
      this.$router.replace('/login');
    }
  }
};
</script>
