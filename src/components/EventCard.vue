<template>
  <div class="card">
    <div class="card-header" :style="{ backgroundColor: color }">
      {{ type }}
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ subject }}</h5>
      <p class="card-text">{{ professor }}</p>
      <p class="card-text">Group {{ group }}</p>
      <p class="card-text">
        <small>From {{ startDate }} to {{ endDate }}</small>
      </p>
      <div class="card-text">
        <small>From {{ startTime }} to {{ endTime }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'event-card',
  props: {
    type: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    professor: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
};
</script>
