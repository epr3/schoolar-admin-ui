<template>
  <guest-layout>
    <div class="row">
      <div class="col-sm-4 offset-4 mt-5">
        <div v-if="!showFacultyForm" class="card card__home">
          <div class="card-body">
            <base-button
              class="mb-2"
              block
              type="primary"
              @click="toggleShowFacultyForm"
              >Create a new faculty</base-button
            >
            <base-button
              router-path="/accounts"
              class="mb-2"
              block
              type="secondary"
              >Manage accounts</base-button
            >
            <base-button
              router-path="/event_types"
              class="mb-2"
              block
              type="secondary"
              >Manage event types</base-button
            >
            <div
              class="dropdown"
              :class="{ show: showFacultyDropdown }"
              v-if="faculties.length"
              @click="toggleShowFacultyDropdown"
            >
              <base-button block type="info"
                >Select an existing faculty</base-button
              >
              <div class="dropdown-menu" :class="{ show: showFacultyDropdown }">
                <router-link
                  v-for="item in faculties"
                  :key="item.id"
                  class="dropdown-item"
                  :to="`/faculties/${item.id}`"
                  >{{ item.name }}</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <faculty-form v-else @reset:form="toggleShowFacultyForm" />
      </div>
    </div>
  </guest-layout>
</template>

<script>
import FACULTIES_QUERY from '../graphql/Faculty/Faculties.gql';
import PROFILE_QUERY from '../graphql/Auth/Profile.gql';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseButton from '@/components/BaseButton.vue';

import FacultyForm from '@/containers/FacultyForm.vue';

export default {
  name: 'home',
  data: () => ({
    showFacultyForm: false,
    showFacultyDropdown: false,
    faculties: [],
    profile: null
  }),
  apollo: {
    faculties: FACULTIES_QUERY,
    profile: PROFILE_QUERY
  },
  components: {
    GuestLayout,
    BaseButton,
    FacultyForm
  },
  methods: {
    toggleShowFacultyForm() {
      this.showFacultyForm = !this.showFacultyForm;
    },
    toggleShowFacultyDropdown() {
      this.showFacultyDropdown = !this.showFacultyDropdown;
    }
  }
};
</script>
