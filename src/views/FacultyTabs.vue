<template>
  <guest-layout>
    <div class="container">
      <div class="card">
        <div class="card-body">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <span class="nav-link" @click="tab = 1" :class="{ active: tab === 1 }">Groups</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" @click="tab = 2" :class="{ active: tab === 2 }">Subjects</span>
            </li>
          </ul>
          <div class="tab-content p-5">
            <div class="tab-pane" :class="{ show: tab === 1, active: tab === 1 }" v-if="tab === 1">
              <group-tab />
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-container />
  </guest-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import GuestLayout from '@/layouts/GuestLayout.vue';

import GroupTab from '@/containers/GroupTab.vue';
import ModalContainer from '@/containers/ModalContainer.vue';

@Component({
  components: {
    GuestLayout,
    GroupTab,
    ModalContainer
  }
})
export default class FacultyTabs extends Vue {
  private tab = 1;
}
</script>

