<template>
  <div class="container">
    <div class="row px-3">
      <slot name="filter"></slot>
      <div class="row">
        <div class="col-sm-4">
          <div class="row d-flex align-items-center">
            <div class="col col-sm-12">
              <base-input type="text" v-model="search" :v="$v.search" label="Search"/>
            </div>
            <div class="col">
              <div class="btn-group">
                <base-button type="primary" @click="fuseFilter">Search</base-button>
                <base-button type="secondary" @click="resetFilter">Reset</base-button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <base-select
            :has-none="false"
            label="Items per page"
            :v="$v.limit"
            v-model="limit"
            :options="[
            { id: 1, label: '1', value: 1 },
            { id: 2, label: '5', value: 5 },
            { id: 3, label: '10', value: 10 },
            { id: 4, label: '25', value: 25 },
            { id: 5, label: '50', value: 50 }
          ]"
          />
        </div>
      </div>
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
            >{{ item }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="index">
            <template v-if="item.id">
              <td
                v-for="(cell, index) in Object.keys(item).filter(
                  item => item !== '__typename'
                )"
                :key="index"
              >{{ item[cell] }}</td>
              <td>
                <slot name="actions" :item="item"/>
              </td>
            </template>
            <td :colspan="Object.keys(item).length + 1" v-else>
              <loading-spinner/>
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
    <base-pagination
      :pages-length="Math.ceil(items.length / limit)"
      :current-page="page"
      :page-action="pageAction"
      :next-action="nextAction"
      :previous-action="previousAction"
    />
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
import { validationMixin } from 'vuelidate';
import paginationMixin from '../mixins/paginationMixin';

import BasePagination from './BasePagination';
import LoadingSpinner from './LoadingSpinner';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import BaseSelect from './BaseSelect';

export default {
  name: 'base-table',
  data: () => ({
    limit: 5,
    search: '',
    searchedItems: []
  }),
  mixins: [validationMixin, paginationMixin],
  validations: {
    search: {},
    limit: {}
  },
  components: {
    LoadingSpinner,
    BaseInput,
    BaseButton,
    BasePagination,
    BaseSelect
  },
  computed: {
    filteredItems() {
      if (this.searchedItems.length) {
        return this.searchedItems.slice(
          (this.page - 1) * this.limit,
          this.page * this.limit
        );
      }
      return this.items.slice(
        (this.page - 1) * this.limit,
        this.page * this.limit
      );
    }
  },
  methods: {
    async fuseFilter() {
      const results = await this.$search(this.search, this.items, {
        keys: this.keys,
        threshold: 0.1
      });
      this.searchedItems = results;
    },
    resetFilter() {
      this.search = '';
      this.fuseFilter();
    }
  },
  props: {
    items: {
      required: true,
      type: Array
    },
    keys: {
      required: true,
      type: Array
    }
  }
};
</script>
