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
            <router-link class="nav-link" to="/accounts" exact>
              Professors
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/event_types" exact>
              Event Types
            </router-link>
          </li>
        </ul>
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
}
</style>

<script>
import { mapState } from 'vuex';

import BaseAlert from '../components/BaseAlert';
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
    ModalContainer
  },
  methods: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    }
  }
};
</script>
