<template>
  <div class="container">
    <div class="row px-3">
      <slot name="filter"></slot>
    </div>
    <table class="table mt-4">
      <template v-if="items.length">
        <thead>
          <tr>
            <th
              v-for="(item, index) in Object.keys(items[0]).filter(
                item => item !== '__typename'
              )"
              :key="index"
            >
              {{ item }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <template v-if="item.id">
              <td
                v-for="(cell, index) in Object.keys(item).filter(
                  item => item !== '__typename'
                )"
                :key="index"
              >
                {{ item[cell] }}
              </td>
              <td>
                <slot name="actions" :item="item" />
              </td>
            </template>
            <td :colspan="Object.keys(item).length + 1" v-else>
              <loading-spinner />
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <td>No data to show.</td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
</template>

<style scoped lang="scss">
th td {
  &::first-letter {
    text-transform: capitalize;
  }
}
</style>

<script>
import LoadingSpinner from './LoadingSpinner';

export default {
  name: 'base-table',
  components: {
    LoadingSpinner
  },
  props: {
    items: {
      required: true,
      type: Array
    }
  }
};
</script>
