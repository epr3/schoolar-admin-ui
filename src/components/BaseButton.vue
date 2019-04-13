<template>
  <button @click="$emit('click')" type="button" :disabled="disabled" class="btn" :class="btnStyle">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BaseButton extends Vue {
  @Prop({ type: String, default: '' }) private readonly type?: string;
  @Prop({ type: String, default: '' }) private readonly size?: string;
  @Prop({ type: Boolean, default: false }) private readonly outline?: boolean;
  @Prop({ type: Boolean, default: false }) private readonly block?: boolean;
  @Prop({ type: Boolean, default: false }) private readonly disabled?: boolean;

  get btnStyle() {
    let style = '';

    if (this.size) {
      style += `btn-${this.size} `;
    }

    if (this.type) {
      if (this.outline) {
        style += `btn-outline-${this.type} `;
      } else {
        style += `btn-${this.type} `;
      }
    }

    if (this.block) {
      style += 'btn-block ';
    }

    if (this.disabled) {
      style += 'btn-disabled ';
    }

    return style.slice(0, -1);
  }
}
</script>

