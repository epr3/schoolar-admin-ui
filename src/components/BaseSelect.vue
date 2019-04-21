<template>
  <div class="form-grou">
    <select class="custom-select" v-model="model" :value="value">
      <option :value="null">{{ label }}</option>
      <option v-for="item in options" :value="item.value" :key="item.id">{{ item.label }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

@Component
export default class BaseSelect extends Vue {
  @Prop({ type: String, required: true }) private readonly label?: string;
  @Prop({ type: String, default: null }) private readonly value!: string;
  @Prop({ type: Object, required: true })
  private readonly v!: typeof validationMixin;
  @Prop({ type: Array, required: true }) private readonly options!: object[];

  get model() {
    return this.value;
  }

  set model(value) {
    this.v.$touch();
    this.$emit('input', value);
  }
}
</script>
