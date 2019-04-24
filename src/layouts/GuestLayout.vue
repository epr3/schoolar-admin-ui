<template>
  <div class="container-fluid container__login">
    <slot></slot>
    <modal-container/>
  </div>
</template>

<style lang="scss">
.container__login {
  height: 100vh;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import ModalContainer from '@/containers/ModalContainer.vue';

@Component({
  components: {
    ModalContainer
  }
})
export default class GuestLayout extends Vue {}
</script>

