<template>
  <div class="loading-container">
    <font-awesome-icon size="3x" icon="spinner" />
  </div>
</template>

<style lang="scss">
.loading-container {
  width: 100%;
  display: flex;
  justify-content: center;
  svg {
    animation: spin 1s infinite;
  }
}

@keyframes spin {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}
</style>

<script>
export default {
  name: 'loading-spinner'
};
</script>
