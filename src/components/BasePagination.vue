<template>
  <nav>
    <ul class="pagination">
      <li class="page-item" @click="previousPage" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#">Previous</a>
      </li>
      <li
        v-for="i in pagesLength"
        class="page-item"
        :class="{ active: i === currentPage }"
        :key="i"
        @click="pageAction(i)"
      >
        <a class="page-link">{{ i }}</a>
      </li>
      <li
        class="page-item"
        @click="nextPage"
        :class="{ disabled: currentPage === pagesLength }"
      >
        <a class="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'base-pagination',
  props: {
    nextAction: {
      type: Function,
      required: true
    },
    previousAction: {
      type: Function,
      required: true
    },
    pageAction: {
      type: Function,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    pagesLength: {
      type: Number,
      required: true
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage !== this.pagesLength) {
        this.nextAction();
      }
    },
    previousPage() {
      if (this.currentPage !== 1) {
        this.previousAction();
      }
    }
  }
};
</script>
