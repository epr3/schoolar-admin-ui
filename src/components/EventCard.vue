<template>
<div class="card">
  <div class="card-header">Card type</div>
  <div class="card-body">
    <h5 class="card-title">Sample Event</h5>
    <p class="card-text">Prof. etc</p>
    <p class="card-text">Group 1000</p>
    <p class="card-text"><small>From xx-xx-xxxx to xx-xx-xxxx</small></p>
    <div class="card-text"><small>From xx:xx to xx:xx</small></div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EventCard extends Vue {}
</script>

