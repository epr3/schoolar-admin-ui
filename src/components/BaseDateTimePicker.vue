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

<script>
import DatePicker from 'vue2-datepicker';

export default {
  components: {
    DatePicker
  },
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [Date, String],
      default: ''
    },
    v: {
      type: Object,
      required: true
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.v.$touch();
        this.$emit('input', value);
      }
    }
  }
};
</script>
