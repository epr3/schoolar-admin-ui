<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5>{{ modalTitle }}</h5>
      <button @click="modalCloseAction" type="button" class="close" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div v-if="$slots['modal-body']" class="modal-body">
      <slot name="modal-body" />
    </div>
    <div v-if="$slots['modal-footer']" class="modal-footer">
      <slot name="modal-footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class BaseModalContent extends Vue {
  @Prop({ required: true, type: String}) private readonly modalTitle!: string;
  @Prop({ required: true, type: Function }) private readonly modalCloseAction!: () => void;
}
</script>

