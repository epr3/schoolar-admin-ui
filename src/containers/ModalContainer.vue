<template>
  <portal to="modal">
    <div
      v-for="modal in modalComponents"
      :key="modal.id"
      class="modal show fade"
      @click="modalClose(modal.id)"
    >
      <div @click.stop class="modal-dialog">
        <component :is="modal.component" v-bind="modal.props" />
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

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'modal-container',
  computed: {
    ...mapState('Modal', ['modalComponents'])
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    })
  }
};
</script>
