<template>
  <div class="card">
    <div class="card-header" :style="{ backgroundColor: color  }">{{ type }}</div>
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

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EventCard extends Vue {
  @Prop({ type: String, required: true }) private readonly type!: string;
  @Prop({ type: String, required: true }) private readonly subject!: string;
  @Prop({ type: String, required: true }) private readonly professor!: string;
  @Prop({ type: String, required: true }) private readonly group!: string;
  @Prop({ type: String, required: true }) private readonly startDate!: string;
  @Prop({ type: String, required: true }) private readonly endDate!: string;
  @Prop({ type: String, required: true }) private readonly startTime!: string;
  @Prop({ type: String, required: true }) private readonly endTime!: string;
  @Prop({ type: String, required: true }) private readonly color!: string;
}
</script>

