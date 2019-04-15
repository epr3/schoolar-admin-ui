<template>
  <guest-layout>
    <div class="container">
      <div class="card">
        <div class="card-body">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <span class="nav-link" :class="{ active: tab === 1 }">Groups</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" :class="{ active: tab === 2 }">Subjects</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" :class="{ active: tab === 3 }">Events</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import GuestLayout from '@/layouts/GuestLayout.vue';

@Component({
  components: {
    GuestLayout
  }
})
export default class FacultyTabs extends Vue {
  private tab = 1;
}
</script>

