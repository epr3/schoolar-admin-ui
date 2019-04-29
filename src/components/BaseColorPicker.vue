<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <color-picker v-model="model" :value="value"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

import { Chrome } from 'vue-color';

@Component({
  components: {
    'color-picker': Chrome
  }
})
export default class BaseColorPicker extends Vue {
  @Prop({ type: String, required: true }) private readonly label?: string;
  @Prop({ type: String, default: '' }) private readonly placeholder?: string;
  @Prop({ type: String, default: '' }) private readonly value!: { hex: string };
  @Prop({ type: Object, required: true })
  private readonly v!: typeof validationMixin;

  get model() {
    return this.value;
  }

  set model(colorObj: { hex: string }) {
    this.v.$touch();
    this.$emit('input', colorObj.hex);
  }
}
</script>
