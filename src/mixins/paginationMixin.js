export default {
  data: () => ({
    page: 1
  }),
  methods: {
    nextAction() {
      this.page++;
    },
    previousAction() {
      this.page--;
    },
    pageAction(i) {
      this.page = i;
    }
  }
};
