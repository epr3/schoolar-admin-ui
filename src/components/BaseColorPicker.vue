<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <color-picker v-model="model" :value="value" />
    <div v-if="v.$error" class="invalid-feedback">Field is invalid!</div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';

export default {
  components: {
    'color-picker': Chrome
  },
  props: {
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
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
      set(colorObj) {
        this.v.$touch();
        this.$emit('input', colorObj.hex);
      }
    }
  }
};
</script>
