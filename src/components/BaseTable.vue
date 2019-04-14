<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(item, index) in Object.keys(items[0])" :key="index">{{ item }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td v-for="(cell, index) in Object.values(item)" :key="index">{{ cell }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BaseTable extends Vue {
  @Prop({ required: true, type: Array }) private readonly items!: object[];
}
</script>

