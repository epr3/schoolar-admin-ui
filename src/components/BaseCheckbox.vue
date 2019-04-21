<template>
  <div class="form-group">
    <div class="custom-control custom-checkbox">
      <input
        :id="id"
        type="checkbox"
        class="custom-control-input"
        :class="{
          'is-invalid': v.$error
        }"
        :checked="value"
        v-model="model"
      >
      <label :for="id" class="custom-control-label">{{ label }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

@Component
export default class BaseCheckbox extends Vue {
  @Prop({ type: String, required: true }) private readonly id!: string;
  @Prop({ type: String, required: true }) private readonly label!: string;
  @Prop({ type: Boolean, default: false }) private readonly value!: string;
  @Prop({ type: Object, required: true })
  private readonly v!: typeof validationMixin;

  get model() {
    return this.value;
  }

  set model(value) {
    this.v.$touch();
    this.$emit('input', value);
  }
}
</script>
