<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <input
      :type="type"
      class="form-control"
      :class="{
        'is-invalid': v.$error
      }"
      v-model="model"
      :placeholder="placeholder"
    >
    <div v-if="v.$error" class="invalid-feedback">Field is invalid!</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

@Component
export default class BaseInput extends Vue {
  @Prop({ type: String, required: true }) private readonly label?: string;
  @Prop({ type: String, required: true }) private readonly type!: string;
  @Prop({ type: String, default: ''}) private readonly placeholder?: string;
  @Prop({ type: [String, Number] , default: ''}) private readonly value!: string | number;
  @Prop({ type: Object, required: true }) private readonly v!: typeof validationMixin;

  get model() {
    return this.value;
  }

  set model(value) {
    this.v.$touch();
    this.$emit('input', value);
  }

}
</script>

