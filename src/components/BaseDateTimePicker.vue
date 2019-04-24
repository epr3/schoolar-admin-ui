<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <date-picker
      lang="en"
      :type="type"
      :class="{
        'is-invalid': v.$error
      }"
      v-model="model"
      :format="format"
      :placeholder="placeholder"
      confirm
      input-class="form-control"
      width="100%"
    />
    <div v-if="v.$error" class="invalid-feedback">Field is invalid!</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

import DatePicker from 'vue2-datepicker';

@Component({
  components: {
    DatePicker
  }
})
export default class BaseDateTimePicker extends Vue {
  @Prop({ type: String, required: true }) private readonly label?: string;
  @Prop({ type: String, required: true }) private readonly type!: string;
  @Prop({ type: String, required: true }) private readonly format!: string;
  @Prop({ type: String, default: ''}) private readonly placeholder?: string;
  @Prop({ type: [Date, String] , default: ''}) private readonly value!: string;
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

