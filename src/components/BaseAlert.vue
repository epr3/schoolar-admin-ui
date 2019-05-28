<template>
  <div :class="['alert', alertType]">{{ message }}</div>
</template>

<script>
export default {
  name: 'base-alert',
  props: {
    type: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    alertType() {
      return this.type ? `alert-${this.type}` : '';
    }
  }
};
</script>
