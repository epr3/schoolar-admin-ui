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
            >Create a new faculty</base-button>
            <base-button router-path="/accounts" class="mb-2" block type="secondary">Manage accounts</base-button>
            <base-button router-path="/event_types" class="mb-2" block type="secondary">Manage event types</base-button>
            <div
              class="dropdown"
              :class="{ show: showFacultyDropdown }"
              v-if="faculties.length"
              @click="toggleShowFacultyDropdown"
            >
              <base-button block type="info">Select an existing faculty</base-button>
              <div class="dropdown-menu" :class="{ show: showFacultyDropdown }">
                <router-link
                  v-for="item in faculties"
                  :key="item.id"
                  class="dropdown-item"
                  :to="`/faculties/${item.id}`"
                >{{ item.name }}</router-link>
              </div>
            </div>
          </div>
        </div>
        <faculty-form v-else @reset:form="toggleShowFacultyForm"/>
      </div>
    </div>
  </guest-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import GuestLayout from '@/layouts/GuestLayout.vue';

import BaseButton from '@/components/BaseButton.vue';

import FacultyForm from '@/containers/FacultyForm.vue';

@Component({
  components: {
    GuestLayout,
    BaseButton,
    FacultyForm
  }
})
export default class Home extends Vue {
  private showFacultyForm = false;
  private showFacultyDropdown = false;
  @Action('getFaculties', { namespace: 'Faculty' }) private getFaculties: any;
  @Action('getProfile', { namespace: 'User' }) private getProfile: any;
  @Getter('faculties/query', { namespace: 'entities' })
  private facultyQuery: any;

  get faculties() {
    return this.facultyQuery().all();
  }

  private mounted() {
    this.getProfile();
    this.getFaculties();
  }

  private toggleShowFacultyForm() {
    this.showFacultyForm = !this.showFacultyForm;
  }

  private toggleShowFacultyDropdown() {
    this.showFacultyDropdown = !this.showFacultyDropdown;
  }
}
</script>
