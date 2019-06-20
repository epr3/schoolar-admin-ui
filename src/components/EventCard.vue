<template>
  <div class="card mb-2">
    <div class="card-header" :style="{ backgroundColor: color }">
      <font-awesome-icon icon="edit" @click="$emit('click')" />
      <button
        @click="deleteAction"
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ subject }} - {{ type }}</h5>
      <p class="card-text">
        <font-awesome-icon icon="user-tie" />
        {{ professor }}
      </p>
      <p class="card-text">
        <font-awesome-icon icon="building" />
        {{ room }}
      </p>
      <p class="card-text">
        <font-awesome-icon icon="calendar-plus" />
        {{ frequency }}
      </p>
      <p class="card-text">
        <font-awesome-icon icon="users" />
        {{ group }}
      </p>
      <p class="card-text">
        <small>
          <font-awesome-icon icon="calendar" />
          {{ startDate }} - {{ endDate }}
        </small>
      </p>
      <div class="card-text">
        <small>
          <font-awesome-icon icon="clock" />
          {{ startTime }} - {{ endTime }}
        </small>
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
    room: {
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
    frequency: {
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
    },
    deleteAction: {
      type: Function,
      required: true
    }
  }
};
</script>
