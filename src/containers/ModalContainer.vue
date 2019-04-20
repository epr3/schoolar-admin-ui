<template>
  <portal to="modal">
    <div
      class="modal"
      v-if="modalOpen"
      @click="modalClose"
      :class="{ fade: modalOpen, show: modalOpen }"
    >
      <div @click.stop class="modal-dialog">
        <component :is="modalComponent" v-bind="modalProps" />
      </div>
    </div>
  </portal>
</template>

<style lang="scss">
.modal {
  &.show {
    display: block;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class ModalContainer extends Vue {
  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @State('modalProps', { namespace: 'Modal' }) private modalProps: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
}
</script>
